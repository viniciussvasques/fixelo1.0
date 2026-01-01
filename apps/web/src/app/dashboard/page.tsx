import { auth } from '@/lib/auth';
import { prisma } from '@fixelo/database';
import { redirect } from 'next/navigation';
import { Calendar, Clock, DollarSign, MapPin } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardHome() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Fetch upcoming bookings
  const upcomingBookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
      status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] }
    },
    include: {
      serviceType: true,
      address: true,
    },
    orderBy: { scheduledDate: 'asc' },
    take: 3
  });

  // Fetch recent bookings
  const recentBookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
      status: 'COMPLETED'
    },
    include: {
      serviceType: true,
    },
    orderBy: { scheduledDate: 'desc' },
    take: 3
  });

  // Calculate stats
  const totalBookings = await prisma.booking.count({
    where: { userId: session.user.id }
  });

  const completedBookings = await prisma.booking.count({
    where: { userId: session.user.id, status: 'COMPLETED' }
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your home services</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{upcomingBookings.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalBookings}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{completedBookings}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Services</h2>
            <Link href="/dashboard/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No upcoming services</h3>
            <p className="mt-2 text-gray-500">Book a cleaning service to get started</p>
            <Link
              href="/book"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Book Now
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {upcomingBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/dashboard/bookings/${booking.id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.serviceType.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${booking.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'ACCEPTED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                          }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        {booking.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.address.city}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${booking.totalPrice}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Services</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{booking.serviceType.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-green-600">Completed</span>
                    <Link
                      href={`/dashboard/bookings/${booking.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/book"
          className="block p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-white mb-2">Book a New Service</h3>
          <p className="text-blue-100">Schedule your next cleaning in minutes</p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Profile</h3>
          <p className="text-gray-600">Update your preferences and saved addresses</p>
        </Link>
      </div>
    </div>
  );
}

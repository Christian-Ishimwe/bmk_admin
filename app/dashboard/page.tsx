import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from 'lucide-react'

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">$45,231.89</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Active Users</CardTitle>
            <Users className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">+2350</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Products Listed</CardTitle>
            <Package className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">12,234</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">+19% from last month</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">573</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">+201 since yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium dark:text-white">Quick Actions</h3>
        <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-yellow-100">
            Add New Product
          </Button>
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-yellow-100">
            View Recent Orders
          </Button>
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-yellow-100">
            Manage Users
          </Button>
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-yellow-100">
            Generate Reports
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center dark:text-gray-200">
                <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
                <span>New order #1234 received</span>
              </li>
              <li className="flex items-center dark:text-gray-200">
                <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
                <span>User John Doe updated their profile</span>
              </li>
              <li className="flex items-center dark:text-gray-200">
                <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
                <span>New product &quot;Wireless Headphones&quot; added</span>
              </li>
              <li className="flex items-center dark:text-gray-200">
                <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
                <span>Subscription plan &quot;Premium&quot; purchased by user #5678</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
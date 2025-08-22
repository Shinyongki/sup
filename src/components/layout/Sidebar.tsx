import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  Home,
  MapPin,
  CheckSquare,
  FolderOpen,
  Calculator,
  Calendar,
  Phone,
  BarChart3
} from 'lucide-react'

const navigation = [
  {
    name: '대시보드',
    href: '/',
    icon: Home
  },
  {
    name: '지역별 관리',
    icon: MapPin,
    children: [
      { name: '창원', href: '/region/창원' },
      { name: '거제도', href: '/region/거제도' },
      { name: '오도산', href: '/region/오도산' },
      { name: '산청', href: '/region/산청' },
      { name: '거창', href: '/region/거창' },
      { name: '하동', href: '/region/하동' }
    ]
  },
  {
    name: '일정 관리',
    href: '/schedule',
    icon: Calendar
  },
  {
    name: '연락처',
    href: '/contacts',
    icon: Phone
  }
]

export function Sidebar() {
  const location = useLocation()
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.href ? (
              <Link
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700">
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </div>
                {item.children && (
                  <div className="ml-6 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={cn(
                          'block px-3 py-2 rounded-lg text-sm transition-colors',
                          location.pathname === child.href
                            ? 'bg-green-100 text-green-800'
                            : 'text-gray-600 hover:bg-gray-100'
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
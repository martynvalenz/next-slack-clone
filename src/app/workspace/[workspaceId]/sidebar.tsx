import UserButton from '@/features/auth/components/user-button'
import React from 'react'
import WorkspaceSwitcher from './workspace-switcher'
import SidebarButton from './sidebar-button'
import { Bell, Home, MessagesSquare, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className='w-[70px] h-full bg-[rgb(72,19,73)] flex flex-col justify-between space-y-4 items-center pt-[9px] pb-4'>
      <div className='flex flex-col space-y-4 items-center'>
        <WorkspaceSwitcher />
        <SidebarButton 
          icon={Home}
          label='Home'
          isActive={pathname.includes('/workspace')}
        />
        <SidebarButton 
          icon={MessagesSquare}
          label='DMs'
          isActive={pathname.includes('/messages')}
        />
        <SidebarButton 
          icon={Bell}
          label='Activity'
          isActive={pathname.includes('/activity')}
        />
        <SidebarButton 
          icon={MoreHorizontal}
          label='More'
          isActive={pathname.includes('/more')}
        />
      </div>
      <div className='flex flex-col items-center justify-center gap-y-1 mt-auto'>
        <UserButton />
      </div>
    </aside>
  )
}

export default Sidebar
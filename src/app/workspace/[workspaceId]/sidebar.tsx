import UserButton from '@/features/auth/components/user-button'
import React from 'react'
import WorkspaceSwitcher from './workspace-switcher'

const Sidebar = () => {
  return (
    <aside className='w-[70px] h-full bg-[rgb(72,19,73)] flex flex-col space-y-4 items-center justify-between pt-[9px] pb-4'>
      <WorkspaceSwitcher />
      <div className='flex flex-col items-center justify-center gap-y-1'>
        <UserButton />
      </div>
    </aside>
  )
}

export default Sidebar
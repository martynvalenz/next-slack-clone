import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaChevronDown } from 'react-icons/fa'

interface HeaderProps {
  memberName?: string
  memberImage?: string
  onClick?: () => void
}

const Header = ({
  memberName = 'Unknown',
  memberImage,
  onClick
}: HeaderProps) => {
  const avatarFallback = memberName.charAt(0).toUpperCase()

  return (
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
      <Button
        variant='ghost'
        className='text-lg font-semibold px-2 overflow-hidden w-auto'
        size="sm"
        onClick={onClick}
      >
        <Avatar className="size-6 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className='trncate'>{memberName}</span>
        <FaChevronDown className='ml-2 size-2.5' />
      </Button>
    </div>
  )
}

export default Header
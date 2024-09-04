import {format} from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface ConversationHeroProps {
  name?:string
  image?:string
}

const ConversationHero = ({
  name = 'Member',
  image
}:ConversationHeroProps) => {
  return (
    <div className='mt-[88px] mx-5 mb-4'>
      <div className='flex items-center gap-1 mb-2'>
        <Avatar className='size-14 mr-2'>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </div>
      <p className='text-2xl font-bold flex items-center mb-2'>
        # {name}
      </p>
      <p>
        This conversation is just between you and <strong>{name}</strong>. You can share messages, files, and more.
      </p>
    </div>
  )
}

export default ConversationHero
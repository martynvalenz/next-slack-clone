import { Button } from '@/components/ui/button'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useAuthActions } from "@convex-dev/auth/react";

const SocialLogin = () => {
  const { signIn } = useAuthActions();

  return (
    <div className='flex flex-col space-y-2.5'>
      <Button 
        disabled={false}
        onClick={() => void signIn("google")}
        className='w-full relative'
        size="lg"
        variant="outline"
      >
        <FcGoogle className='size-6 absolute top-2 left-2.5' />
        Continue with Google
      </Button>
      <Button 
        disabled={false}
        onClick={() => void signIn("github")}
        className='w-full relative'
        size="lg"
        variant="outline"
      >
        <FaGithub className='size-6 absolute top-2 left-2.5' />
        Continue with Github
      </Button>
    </div>
  )
}

export default SocialLogin
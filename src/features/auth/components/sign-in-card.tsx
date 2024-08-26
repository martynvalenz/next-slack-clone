import {FcGoogle} from 'react-icons/fc'
import {FaGithub} from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { type SignInFlow } from '../types'
import { useState } from 'react'

interface Props {
  setState:(state:SignInFlow) => void
}

const SignInCard = ({
  setState
}:Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  return (
    <Card className='w-full h-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-5 px-0 pb-0'>
        <form action="" className='flex flex-col space-y-2.5'>
          <Input 
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            type='email'
            required
          />
          <Input 
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            type='password'
            required
          />
          <Button type='submit' className='w-full' size="lg" disabled={false}>
            Sign In
          </Button>
        </form>
        <Separator />
        <div className='flex flex-col space-y-2.5'>
          <Button 
            disabled={false}
            onClick={() => {}}
            className='w-full relative'
            size="lg"
            variant="outline"
          >
            <FcGoogle className='size-6 absolute top-2 left-2.5' />
            Continue with Google
          </Button>
          <Button 
            disabled={false}
            onClick={() => {}}
            className='w-full relative'
            size="lg"
            variant="outline"
          >
            <FaGithub className='size-6 absolute top-2 left-2.5' />
            Continue with Github
          </Button>
        </div>
        <p className='text-xs text-muted-foreground'>
          Don&apos;t have an account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState('signUp')}>Sign Up</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignInCard
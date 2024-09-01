import dynamic from "next/dynamic"
import type Quill from "quill"
import { useRef } from "react"
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false })

interface ChatInputProps {
  placeholder:string
}

const ChatInput = ({placeholder}:ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null)
  // editorRef.current?.focus()

  return (
    <div className="px-5 w-full ">
      <Editor 
        placeholder={placeholder}
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
        variant="create"
      />
    </div>
  )
}

export default ChatInput
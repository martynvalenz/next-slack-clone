interface Props {
  params:{
    workspaceId: string
  }
}

const WorkspacePage = ({params}:Props) => {
  return (
    <div>
      ID {params.workspaceId}
    </div>
  )
}

export default WorkspacePage
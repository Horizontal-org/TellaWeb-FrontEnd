import { useEffect } from "react"
import { useRouter } from "next/router"
import { useGetByIdQuery } from "packages/state/services/project"
import { useToast } from "./ToastWrapper"

// The current /project/[projectId] project; a deleted or unknown one sends the user back to the list
export const useProject = () => {
  const router = useRouter()
  const handleToast = useToast()
  const projectId = router.query.projectId as string | undefined
  const result = useGetByIdQuery(projectId, { skip: !projectId })
  const notFound = result.error && "status" in result.error && result.error.status === 404

  useEffect(() => {
    if (!notFound) return
    handleToast("Project not found", "danger")
    router.replace("/project")
  }, [notFound])

  return result
}

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ProjectSettingsPage } from "packages/ui";
import { useToast } from "../../../components/ToastWrapper";
import {
  useDeleteProjectMutation,
  useEditProjectMutation,
  useGetByIdQuery,
} from "packages/state/services/project";
import { ReportQuery } from "packages/state/domain/report";
import { useReportFileDownloader } from "packages/state/features/files/useReportFileDownloader";
import { Menu } from "components/Menu";

export const ProjectById = () => {

  const router = useRouter();
  const handleToast = useToast()

  const { data: currentProject, refetch } = useGetByIdQuery(
    "" + router.query.projectId
  );
  const [editProject, editProjectResult] = useEditProjectMutation()
  const [deleteProject, deleteProjectResult] = useDeleteProjectMutation()

  const { push } = useRouter();
  const [downloadReportFile] = useReportFileDownloader();

  useEffect(() => {
    if (editProjectResult.isSuccess) {
      handleToast("Values updated!");
      refetch()
    }
    if (editProjectResult.error && "status" in editProjectResult.error) {
      handleToast(editProjectResult.error.data.message, "danger");
    }
  }, [editProjectResult.status]);


  useEffect(() => {
    if (deleteProjectResult.isSuccess) {
      handleToast("Project deleted");
      router.push("/project")
    }
    if (deleteProjectResult.error && "status" in deleteProjectResult.error) {
      handleToast(deleteProjectResult.error.data.message, "danger");
    }
  }, [deleteProjectResult.status]);


  return currentProject ? (
    <ProjectSettingsPage
      project={currentProject}
      onManage={() => {
        push(`/project/${currentProject.id}/users`);
      }}      
      onRename={(newName) => {
        editProject({
          id: currentProject.id,
          name: newName
        })
      }}
      onEdit={(editObject) => {
        editProject({
          id: currentProject.id,
          ...editObject
        })
      }}
      onDelete={() => {
        deleteProject({id: currentProject.id})
      }}
      sidebar={<Menu />}
    /> 
  ) : null;
};


export default ProjectById;

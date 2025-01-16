import Modal from "@/components/Modal";
import React from "react";
import { formatISO } from "date-fns";
import useProjectStore from "@/state/project.state";
import { useShallow } from "zustand/shallow";

const ModalNewProject = () => {
  const {
    createProject,
    isLoading,
    isModalOpen,
    toggleModal,
    projectDetails,
    setProjectDetails,
  } = useProjectStore(
    useShallow((state) => ({
      createProject: state.createProject,
      isLoading: state.isLoading,
      isModalOpen: state.isModalOpen,
      toggleModal: state.toggleModal,
      projectDetails: state.projectDetails,
      setProjectDetails: state.setProjectDetails,
    })),
  );

  const handleSubmit = async () => {
    if (
      !projectDetails?.name ||
      !projectDetails?.startDate ||
      !projectDetails?.endDate
    )
      return;
    const formattedStartDate = formatISO(new Date(projectDetails.startDate), {
      representation: "complete",
    });
    const formattedEndDate = formatISO(new Date(projectDetails?.endDate), {
      representation: "complete",
    });

    await createProject();
  };

  const isFormValid = () => {
    return (
      projectDetails?.name &&
      projectDetails?.startDate &&
      projectDetails?.endDate
    );
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isModalOpen} onClose={toggleModal} name="Create New Project">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Project Name"
          value={projectDetails?.name}
          onChange={(e) => setProjectDetails({ name: e.target.value })}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={projectDetails?.description}
          onChange={(e) => setProjectDetails({ description: e.target.value })}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={projectDetails?.startDate}
            onChange={(e) => setProjectDetails({ startDate: e.target.value })}
          />
          <input
            type="date"
            className={inputStyles}
            value={projectDetails?.endDate}
            onChange={(e) => setProjectDetails({ endDate: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewProject;

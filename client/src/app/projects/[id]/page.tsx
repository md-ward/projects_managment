"use client";

import React, { useState, useEffect } from "react";
import Board from "../BoardView";
import Timeline from "../TimelineView";
import Table from "../TableView";
import useProjectStore from "@/state/project.state";
import useTaskStore from "@/state/task.state";
import ProjectHeader from "@/components/ProjectComponents/ProjectHeader";
import ModalNewTask from "@/components/TasksComponents/ModalNewTask";
import DeleteTaskModal from "@/components/TasksComponents/DeleteTaskModal";
import { useShallow } from "zustand/shallow";

type Props = {
  params: { id: string };
};

const Project = ({ params }: Props) => {
  const getProject = useProjectStore(useShallow((state) => state.getProject));
  const { getTasks, isModalNewTaskOpen } = useTaskStore(
    useShallow((state) => ({
      getTasks: state.getTasks,
      isModalNewTaskOpen: state.isModalNewTaskOpen,
    })),
  );
  const { id } = params;
  useEffect(() => {
    getProject(Number(id));
    getTasks(Number(id));
  }, [getProject, id, getTasks]);
  const [activeTab, setActiveTab] = useState("Board");

  return (
    <div className="flex flex-col ">
      {isModalNewTaskOpen && <ModalNewTask />}{" "}
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <DeleteTaskModal />
      {activeTab === "Board" && <Board />}
      {activeTab === "Timeline" && <Timeline />}
      {activeTab === "Table" && <Table />}
    </div>
  );
};

export default Project;

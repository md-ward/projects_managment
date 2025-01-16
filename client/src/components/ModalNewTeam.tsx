import Modal from "@/components/Modal";
import useSearchStore from "@/state/search.state";
import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import useTeamStore from "@/state/teams.state";
import { Project, Team } from "@/state/api";
import useProjectStore from "@/state/project.state";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewTeam = ({ isOpen, onClose }: Props) => {
  const projects = useProjectStore((state) => state.projects);

  //! 1. Create a new state variable for the team name
  const [teamName, setTeamName] = useState("");

  //!2. Updated description state
  const [description, setDescription] = useState("");
  //! 3. Updated members state
  const [members, setMembers] = useState<Member[]>([]);

  const [newMember, setNewMember] = useState("");
  //! Get newTeam and isLoading from the team store
  const { newTeam, isLoading } = useTeamStore();

  //! Get search results from the search store
  const { results, searchUsers, setResults } = useSearchStore();
  const [selectedProjectId, setSelectedProjectId] = useState<number>();
  //! Updated Member type
  type Member = { fullname: string; userId: number };
  //! Updated filterResults logic
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        const trimmedQuery = query.trim(); // Remove leading/trailing spaces
        searchUsers(trimmedQuery);
      }, 300),
    [searchUsers],
  );
  // Cleanup debounced function on component unmount
  useEffect(() => {
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  //? Filter results based on the updated members list
  useEffect(() => {
    if (projects.length==1 ) {
      setSelectedProjectId(projects[0].id);
      console.log(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const filterResults = (updatedMembers: Member[]) => {
    setResults(
      results.filter(
        (user) =>
          !updatedMembers.some((member) => member.userId === user.userId),
      ),
    );
  };

  const handleAddMember = (member: Member) => {
    if (!members.some((m) => m.userId === member.userId)) {
      const updatedMembers = [...members, member];
      setMembers(updatedMembers);
      filterResults(updatedMembers); //! Filter results based on the updated members list
      console.log("Members: ", updatedMembers);
      setNewMember("");
    }
  };

  const handleRemoveMember = (member: Member) => {
    const updatedMembers = members.filter((m) => m.userId !== member.userId);
    setMembers(updatedMembers);
    filterResults(updatedMembers);
  };
  const handleSubmit = async () => {
    if (!teamName || !members.length || selectedProjectId === null) return;

    const team: Team = {
      teamName,
      description,
      membersIds: members.map((member) => member.userId),
      projectId: selectedProjectId,
    };

    console.log(team);
    
    try {
      newTeam(team);
      setTeamName("");
      setDescription("");
      setMembers([]);
      setNewMember("");
      // setSelectedProjectId(null);
      onClose(); // Close modal on success
    } catch (e) {
      console.error("Failed to create team:", e);
      // setError("Unable to create team. Please try again.");
    }
  };

  const isFormValid = () => {
    return teamName && members.length > 0;
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Team">
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
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              className={inputStyles}
              placeholder="Search Users (Email or Username)"
              value={newMember}
              onChange={(e) => {
                setNewMember(e.target.value);
                debouncedSearch(e.target.value);
              }}
            />
          </div>
          <div>
            <ul className="space-y-2 rounded p-2 text-black">
              {results.map((member, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded border border-gray-300 p-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white"
                >
                  <p>{member.fullname}</p>
                  <button
                    type="button"
                    className="rounded-md bg-green-500 px-2 py-1 text-white shadow-sm hover:bg-green-600"
                    onClick={() => {
                      handleAddMember({
                        fullname: member.fullname,
                        userId: member.userId,
                      } as Member);
                    }}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold dark:text-white">
              Selected Members:
            </h3>
            <ul className="space-y-2">
              {members.map((member, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded border border-gray-300 p-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white"
                >
                  {member.fullname}
                  <button
                    type="button"
                    className="rounded-md bg-red-500 px-2 py-1 text-white shadow-sm hover:bg-red-600"
                    onClick={() => handleRemoveMember(member)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {projects.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Project
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              onChange={(e) => {
                setSelectedProjectId(parseInt(e.target.value));
              }}
            >
              <option value="">Select Project</option>
              {projects.map((project: Project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTeam;

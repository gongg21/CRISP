import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import { RepoNode } from "@shared/types/PeerReview";
import { NavLink } from "@mantine/core";
import { IconFileText, IconFolder, IconFolderOpen } from '@tabler/icons-react';

type PeerReviewFileTreeProps = {
  repoNode: RepoNode;
  currFile: string;
  openFile: (filePath: string) => void;
}

const PeerReviewFileTree: React.FC<PeerReviewFileTreeProps> = ({ 
  repoNode,
  currFile,
  openFile,
 }) => {
  
  const [openDirs, setOpenDirs] = useState<{ [path: string]: boolean }>({});
  
  if (repoNode.type === 'file') {
    return (
      <NavLink
        label={repoNode.name}
        leftSection={<IconFileText size={16} />}
        active={repoNode.path === currFile}
        onClick={() => openFile(repoNode.path)}
      />
    )
  }

  const isOpen = openDirs[repoNode.path] ?? false;
  return (
    <>
      <NavLink
        label={repoNode.name || "root"}
        leftSection={ isOpen ? <IconFolderOpen size={16} /> : <IconFolder size={16} /> }
        onClick={() => setOpenDirs(prev => ({ ...prev, [repoNode.path]: !isOpen }))}
      />
      { isOpen && 
        repoNode.children?.map(child => (
        <PeerReviewFileTree 
          key={child.path}
          repoNode={child}
          currFile={currFile}
          openFile={openFile}
        />
      ))}
    </>
  );
}

export default PeerReviewFileTree;

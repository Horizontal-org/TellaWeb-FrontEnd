import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import cn from "classnames";
import axios from "axios";
import { version } from 'package.json'
import { BsX } from "react-icons/bs";

const GITHUB_API_TELLAWEB_REPO = 'https://api.github.com/repos/Horizontal-org/tellaweb/releases/latest'
const GITHUB_TELLAWEB_REPO = 'https://github.com/Horizontal-org/tellaweb/releases/latest'

type Props = {
};  

export const NewVersionBanner: FunctionComponent<React.PropsWithChildren<Props>> = ({
  
}: Props) => {
  const [newVersion, handleNewVersion] = useState(null)
  const [showBanner, handleShowBanner] = useState(false)

  useEffect(() => {
    const checkForNewVersion = async() => {
      try {
        const releases = await axios.get(GITHUB_API_TELLAWEB_REPO)
        const tag = releases.data.tag_name || null 
        const currentHiddenVersion = localStorage.getItem("tellaweb_hidden_version");
  
        if (tag && tag !== currentHiddenVersion && (tag !== version)) {
          localStorage.removeItem('tellaweb_hidden_version')
          handleShowBanner(true)
          handleNewVersion(tag)
        }
      } catch (e) {
        // dont show anything 
      }
    }

    checkForNewVersion()
  }, [])

  return newVersion && showBanner && (
    <div className="w-full p-4 rounded bg-blue-300 flex items-center justify-between">
      <a href={GITHUB_TELLAWEB_REPO} target="_blank" className=" text-white text-base font-bold">
        New version of Tellaweb {newVersion} available!  
      </a>
      <div className='cursor-pointer' onClick={() => {
        handleShowBanner(false)
        localStorage.setItem('tellaweb_hidden_version', newVersion)
      }}>
        <BsX color='white' size={20} /> 
      </div>
    </div>
  );
};


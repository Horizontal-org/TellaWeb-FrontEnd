import { FunctionComponent } from "react";
import Img from "next/image";
import { useRouter } from 'next/router'
import { MenuDescription } from "../../domain/Menu";
import { NavButton } from "../NavButton/NavButton";
import logo from "../../assets/tella-sidelogo.png";
import { Can } from "common/casl/Can";

type Props = {
  topMenu: MenuDescription[];
  bottomMenu: MenuDescription[];
};

export const SidebarLayout: FunctionComponent<React.PropsWithChildren<Props>> = ({
  topMenu,
  bottomMenu,
}) => {
  const { push } = useRouter()

  return (
    <div className="flex flex-1 flex-col">
      <div className="pb-16">
        <Img
          onClick={() => {
            push('/project')
          }} 
          className='cursor-pointer'
          src={logo} 
          width="125px" 
          height="36px" 
          alt="Tella logo" 
        />
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <ul className="flex flex-1 flex-col gap-2 w-full">
          {topMenu.map((data, i) => (
            <Can I='read' a={data.permission} key={i}>
              <NavButton key={data.text} {...data} />
            </Can>
          ))}
        </ul>
        <ul className="flex flex-col gap-2 w-full">
          {bottomMenu.map((data, i) => (
            <Can I='read' a={data.permission} key={i}>
              <NavButton key={data.text} {...data} />
            </Can>
          ))}
        </ul>
      </div>
    </div>
  );
};

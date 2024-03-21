import { Tv, Video, Film, Users, Settings, Tag } from "lucide-react";
import { Link } from "react-router-dom";

export const MenuBar = () => {
  return (
    <nav className="border-r-2">
      <ul className="menu flex h-[90.8vh] justify-between">
        <section>
          <li>
            <Link
              to="/videos"
              className="tooltip tooltip-right"
              data-tip="Videos"
            >
              <Video className=" h-5 w-5" viewBox="0 0 24 24" />
            </Link>
          </li>
          <li>
            <Link
              to="/snippets"
              className="tooltip tooltip-right"
              data-tip="Snippets"
            >
              <Film className=" h-5 w-5" viewBox="0 0 24 24" />
            </Link>
          </li>
          <li>
            <Link
              to="/influencers"
              className="tooltip tooltip-right"
              data-tip="Influencers"
            >
              <Users className=" h-5 w-5" viewBox="0 0 24 24" />
            </Link>
          </li>
          <li>
            <Link
              to="/video-types"
              className="tooltip tooltip-right"
              data-tip="Video Types"
            >
              <Tv className=" h-5 w-5" viewBox="0 0 24 24" />
              {/* <BadgeCheck className=" h-5 w-5" viewBox="0 0 24 24" /> */}
            </Link>
          </li>
          <li>
            <Link to="/tags" className="tooltip tooltip-right" data-tip="Tags">
              <Tag className=" h-5 w-5" viewBox="0 0 24 24" />
            </Link>
          </li>
        </section>
        <section>
          <li>
            <Link
              to="/settings/account"
              className="tooltip tooltip-right"
              data-tip="Settings"
            >
              <Settings className=" h-5 w-5" viewBox="0 0 24 24" />
            </Link>
          </li>
        </section>
      </ul>
    </nav>
  );
};

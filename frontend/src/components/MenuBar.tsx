import { Video } from 'lucide-react';
import { Film } from 'lucide-react';
import { Users } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Tag } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MenuBar = () => {

    return (
        <div className='border-r-2'>
            <ul className="menu h-[90.8vh] flex justify-between">
                <div>
                    <li>
                        <Link to="/videos" className="tooltip tooltip-right" data-tip="Videos">
                            <Video className=" h-5 w-5" viewBox="0 0 24 24" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/snippets" className="tooltip tooltip-right" data-tip="Snippets">
                            <Film className=" h-5 w-5" viewBox="0 0 24 24"/>
                        </Link>
                    </li>
                    <li>
                        <Link to="/influencers" className="tooltip tooltip-right" data-tip="Influencers">
                            <Users className=" h-5 w-5" viewBox="0 0 24 24"/>
                        </Link>
                    </li>
                    <li>
                        <Link to="/channels" className="tooltip tooltip-right" data-tip="Channels">
                            <BadgeCheck className=" h-5 w-5" viewBox="0 0 24 24"/>
                        </Link>
                    </li>
                    <li>
                        <Link to="/tags" className="tooltip tooltip-right" data-tip="Tags">
                            <Tag className=" h-5 w-5" viewBox="0 0 24 24"/>
                        </Link>
                    </li>
                </div>
                <div>
                    <li>
                        <Link to="/settings" className="tooltip tooltip-right" data-tip="Settings">
                            <Settings className=" h-5 w-5" viewBox="0 0 24 24"/>
                        </Link>
                    </li>
                </div>
            </ul>
        </div>
    );
};

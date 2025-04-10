import * as React from 'react'; 
import { LangDrop, SupportDrop } from '../../containers';

export const ProfileHeader: React.FC = () => { 
    return (
 
        <div className="profile-header"> 
            <div className="profile-header__left">
            </div>
            <div className="profile-header__right">
                <SupportDrop />
                <LangDrop />  
            </div> 
        </div>
    ); 
} 
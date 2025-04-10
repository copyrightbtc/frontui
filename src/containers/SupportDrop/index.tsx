import * as React from 'react';
import { Button, Menu, SvgIcon } from '@mui/material'; 
import { useIntl } from 'react-intl';
import { SupportIcon } from 'src/assets/images/SupportIcon';

const noColorsRoutes = [
    '/p2p/',
    '/trading/',
];
const shouldColorsRoutes = noColorsRoutes.some(r => location.pathname.includes(r)) && location.pathname !== '/';

export const SupportDrop: React.FC = () => {
    const intl = useIntl();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
 
    return (
        <React.Fragment>
            <Button
                className={`support-button${shouldColorsRoutes ? ' themes' : ''}`}
                aria-controls={open ? 'support-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant="text"
            > 
                <SupportIcon className='support-icon'/>
            </Button>
 
            <Menu
                id="support-menu"
                className={!shouldColorsRoutes ? 'simple_menu' : 'simple_menu theme'}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
 
                <a className="simple_menu_list" onClick={handleClose} href="https://sfortrade.zohodesk.eu/portal/en/newticket" target="_blank" rel="noopener noreferrer"> 
                    <span>{intl.formatMessage({id: 'page.body.landing.button.helpcenter'})}</span>
                    <SvgIcon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px" 
                            y="0px"
                            viewBox="0 0 36 36" 
                        >
                        <path d="M1.7,1.7C1,1.7,0.5,2.2,0.5,2.8c0,0,0,0,0,0v30.3c0,0.6,0.5,1.2,1.2,1.2c0.4,0,0.7-0.2,0.9-0.4l6.6-8.1h25.1
                            c0.6,0,1.2-0.5,1.2-1.2V2.8c0-0.6-0.5-1.2-1.2-1.2H1.7z M2.8,4h30.3v19.4H8.7c-0.4,0-0.7,0.2-0.9,0.4l-4.9,6V4z M9.6,10.3
                            c-1.8,0-3.2,1.5-3.2,3.2c0,1.8,1.5,3.2,3.2,3.2c1.8,0,3.2-1.5,3.2-3.2C12.8,11.8,11.4,10.3,9.6,10.3z M18,10.3
                            c-1.8,0-3.2,1.5-3.2,3.2c0,1.8,1.5,3.2,3.2,3.2c1.8,0,3.2-1.5,3.2-3.2C21.2,11.8,19.8,10.3,18,10.3z M26.4,10.3
                            c-1.8,0-3.2,1.5-3.2,3.2c0,1.8,1.5,3.2,3.2,3.2s3.2-1.5,3.2-3.2C29.7,11.8,28.2,10.3,26.4,10.3z M9.6,12.7c0.5,0,0.9,0.4,0.9,0.9
                            c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9C8.7,13.1,9.1,12.7,9.6,12.7z M18,12.7c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9
                            c-0.5,0-0.9-0.4-0.9-0.9C17.1,13.1,17.5,12.7,18,12.7z M26.4,12.7c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9
                            c-0.5,0-0.9-0.4-0.9-0.9C25.5,13.1,25.9,12.7,26.4,12.7z"/> 
                        </svg>
                    </SvgIcon>             
                </a>
                <a className="simple_menu_list" onClick={handleClose} href="https://t.me/SFORTRADE_Support_bot" target="_blank" rel="noopener noreferrer">
                    <span>Telegram</span>
                    <SvgIcon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px" 
                            y="0px"
                            viewBox="0 0 36 36" 
                        >
                        <path d="M35.5,3.2c-0.3-0.3-0.7-0.4-1-0.2L0.9,13.9c-0.4,0.1-0.6,0.4-0.7,0.8c-0.1,0.4,0.1,0.8,0.4,1L8.4,21L10,31.4
                            c0,0,0,0.1,0,0.1l0,0.1l0.7,0.7h0.1l0,0l0.5,0l0.1,0l0,0l0.1-0.1c0,0,0.1,0,0.1-0.1l5.2-5.5l9.1,6.2c0.2,0.1,0.4,0.2,0.6,0.2
                            c0.1,0,0.2,0,0.3-0.1c0.3-0.1,0.6-0.4,0.6-0.7l8.5-28.1C35.9,3.9,35.8,3.5,35.5,3.2z M32.6,7.5l-6.9,22.9L16,23.7L32.6,7.5z
                            M14.9,25.5l-0.4,0.4l0.2-0.5L14.9,25.5z M13.5,23.3l-0.1,0.1l-1.9,4.3l-1.1-6.8l16.1-10.3L13.6,23.1L13.5,23.3
                            C13.5,23.2,13.5,23.3,13.5,23.3C13.5,23.3,13.5,23.3,13.5,23.3z M27.7,7.3L9.3,19.1l-5.8-4L27.7,7.3z"/>
                        </svg>
                    </SvgIcon> 
                </a>
            </Menu>
 
        </React.Fragment>
    );
} 
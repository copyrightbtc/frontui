import * as React from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { changeLanguage, selectCurrentLanguage, } from '../../modules';
import { languages } from '../../api/config';
import { getLanguageName } from '../../helpers';
import { Button, Menu, MenuItem } from '@mui/material'; 

import enIcon from 'src/assets/images/flags/en.svg';
import ruIcon from 'src/assets/images/flags/ru.svg';

const noColorsRoutes = [
    '/p2p/',
    '/trading/',
];
const shouldColorsRoutes = noColorsRoutes.some(r => location.pathname.includes(r)) && location.pathname !== '/';

export const LangDrop: React.FC = () => {

    const dispatch = useDispatch();
    const handleChangeLanguage = (value: string) => {
        dispatch(changeLanguage(value));
    }
 
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const getLanguageIcon = (name: string): string => {
        if (name === 'ru') {
            return ruIcon;
        } else {
            return enIcon;
        }
    };

    const languageName = useSelector(selectCurrentLanguage);
    return (
        <React.Fragment>
            <Button
                id="leng-button"
                className={`leng-button${shouldColorsRoutes ? ' themes' : ''}`}
                aria-controls={open ? 'lang-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant="text"
            >
                <span>{languageName.toUpperCase()}</span>
                <div className="arrow_menu"></div>
            </Button>
 
            <Menu
                id="lang-menu"
                className={!shouldColorsRoutes ? 'simple_menu' : 'simple_menu theme'}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'leng-button',
                }} 
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {languages.map((l: string) => (
                    <MenuItem onClick={handleClose}> 
                        <img src={getLanguageIcon(l)} alt={l} />
                        <span onClick={e => handleChangeLanguage(l)}>{getLanguageName(l.toLowerCase())}</span>
                    </MenuItem> 
                ))}
            </Menu>
 
        </React.Fragment>
    );
} 
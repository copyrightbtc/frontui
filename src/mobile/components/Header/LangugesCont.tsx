import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeLanguage, selectCurrentLanguage, } from 'src/modules';
import { languages } from '../../../api/config';
import { getLanguageName } from '../../../helpers';
import Accordion from 'react-bootstrap/Accordion'; 
import { ArrowDownward } from 'src/assets/images/ArrowDownward';
import { CheckIcon } from 'src/mobile/assets/images/CheckIcon';
import { GlobeIcon } from 'src/assets/images/sidebar/GlobeIcon';

import enIcon from 'src/assets/images/flags/en.svg';
import ruIcon from 'src/assets/images/flags/ru.svg';
 

export const LangugesCont: React.FC = () => {

    const dispatch = useDispatch();
    const handleChangeLanguage = (value: string) => {
        dispatch(changeLanguage(value));
    }

    const getLanguageIcon = (name: string): string => {
        if (name === 'ru') {
            return ruIcon;
        } else {
            return enIcon;
        }
    };

    const languageName = useSelector(selectCurrentLanguage);

    const renderLanguageListItem = (language, index) => {
        return (
            <div
                key={index}
                className='sub__menu'
                onClick={() => handleChangeLanguage(language)}
            >
                <img src={getLanguageIcon(language)} alt={language} className='langIcon'/>
                <span>{getLanguageName(language)}</span>
                {language === languageName ? <CheckIcon className="checked"/> : ''}
            </div>
        );
    };

    return (
        <React.Fragment>
            <Accordion>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <GlobeIcon className="nav-icon" />
                        <span className="nav-title">{getLanguageName(languageName)}</span>
                        <ArrowDownward className="arrow" />
                    </Accordion.Header>
                    <Accordion.Body>
                        {languages.map(renderLanguageListItem)}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </React.Fragment>
    );
} 
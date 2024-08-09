import React from 'react'
import styles from './css/Styles.module.css'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
const Header = ({title}) => {
  return (
    <div className={styles.navHead}>
        <span className={styles.headTitle}><ChevronLeftIcon/>{title}</span>
    </div>
  )
}

export default Header
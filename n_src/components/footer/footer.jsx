import React from 'react'
import Container from 'react-bootstrap/Container'

import './footer.scss'

const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <footer>
            <Container className="copyright_container">
                <p>&copy; {year !== 2020 ? `2020 - ${year}` : year} Benoît Dubus</p>
                <p>FINAL FANTASY XIV &copy; 2010 - {year} SQUARE ENIX CO., Ltd. FINAL FANTASY est une marque déposée de Square Enix Holdings Co., Ltd. Tous les matériels sont utilisés sous licence.</p>
            </Container>
        </footer>
    )
}

export default Footer

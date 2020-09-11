import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

const InfoBoxes = ({ title, cases, active, green, total, onClick }) => {
    return (
        <Card onClick = {onClick} className={`info ${active && 'info-selected'} ${green && 'border-color'}`}>
            <CardContent>
                <Typography className="info_title" color="textSecondary">
                    {title}
                </Typography>
                <Typography className={`info_cases ${green && 'info_cases-green'}`} variant="h5" component="h2">
                    {cases}
                </Typography>
                <Typography className="info_total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
            
        </Card>
    )
}

export default InfoBoxes

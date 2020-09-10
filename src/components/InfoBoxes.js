import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

const InfoBoxes = ({ title, cases, total }) => {
    return (
        <Card className="info">
            <CardContent>
                <Typography className="info_title" color="textSecondary">
                    {title}
                </Typography>
                <Typography className="info_cases" variant="h5" component="h2">
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

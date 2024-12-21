import React from "react";
import {Card, CardMedia, CardContent, Typography, Button} from "@mui/material";

interface PortfolioCardProps {
    title: string;
    description: string;
    image: string;
    link: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({title,description,image,link}) =>{
    return(
        <Card>
            <CardMedia component="img" height="140" image={image} alt={title} />
            <CardContent>
                <Typography variant="h5">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                <Button href={link} target="_blank" rel="noopener noreferrer" sx={{mt:1}}>
                    View Project
                </Button>
            </CardContent>
        </Card>
    )
}
export default PortfolioCard;
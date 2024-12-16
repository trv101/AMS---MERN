import Typography from "@mui/material/Typography";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useNavigate } from "react-router-dom";

import { CardActionArea } from "@mui/material";

import { Link } from "react-router-dom";

const cardData = [
  {
    title: "Continue as An Admin",
    image:
      "https://img.freepik.com/free-vector/admin-concept-illustration_114360-2248.jpg",
    url: "/login/admin",
  },
  {
    title: "Continue as a Teacher",
    image:
      "https://img.freepik.com/free-vector/teacher-concept-illustration_114360-1638.jpg",
    url: "/login/teacher",
  },
  {
    title: "Continue as a Student",
    image:
      "https://img.freepik.com/free-vector/grades-concept-illustration_114360-5958.jpg",
    url: "/login/student",
  },
];

export default function SignInSide() {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          marginTop: "20vh",
          padding:'0 300px 0'
        }}
      >
        {cardData.map((card, index) => (
          <Card
            key={index}
            sx={{ width: 345, height: 400 }}
            onClick={() => navigate(card.url)}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                height="350"
                image={card.image}
                alt={card.title}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center" }}
                >
                  {card.title.toUpperCase()}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>
      <div>
        <p className=" text-center text-lg text-gray-600 mt-5 ">
          Dont have an account yet?
          <Link
            to="/signup"
            className="font-medium text-purple-600 hover:text-purple-500 ml-2"
          >
            Signup
          </Link>
        </p>
      </div>
    </>
  );
}

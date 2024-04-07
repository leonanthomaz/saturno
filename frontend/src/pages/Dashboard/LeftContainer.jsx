import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@material-ui/core";
import axios from 'axios';

const styles = () => ({
  root: {
    padding: "50px 100px",
    zIndex: 999,
    position: "absolute"
  },
  card: {
    display: "flex",
    height: "calc(100vh - 100px)"
  },
  rightBorder: {
    borderRight: "solid #d0D0D0 1px"
  },
  content: {
    marginTop: 0
  },
  background: {
    position: "absolute",
    height: 200,
    width: "100%",
    top: 0,
    background: "#7159C1"
  },
  rightContainer: {
    background:
      "url(https://hdwallsource.com/img/2014/8/my-neighbor-totoro-wallpaper-27981-28703-hd-wallpapers.jpg) center center",
    flex: 1
  },
  heightAdjust: {
    display: "flex",
    flexDirection: "column"
  },
  paper: {
    background: "#9de1fe",
    padding: 20
  },
  information: {
    color: "#444"
  }
});

const LeftContainer = ({ classes }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:8080/users'); // Endpoint para buscar usuários cadastrados
          setUsers(response.data);
        } catch (error) {
          console.error('Erro ao obter usuários:', error);
        }
      };
  
      fetchUsers();
    }, []);
  
    const handleUserClick = (user) => {
      setSelectedUser(user);
    };
  
    return (
      <Grid item xs={3}>
        <CardHeader
          className={classes.rightBorder}
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              H
            </Avatar>
          }
        />
        <Paper className={classes.paper} elevation={0}>
          <Typography className={classes.information} variant="subheader">
            Acesse nossa comunidade no Discord e fique por dentro das novidades!
          </Typography>
        </Paper>
        <List>
          {users.map(user => (
            <ListItem key={user.id} button onClick={() => handleUserClick(user)}>
              <Avatar>{/* Avatar do usuário */}</Avatar>
              <ListItemText primary={user.name} />
            </ListItem>
          ))}
        </List>
      </Grid>
    );
  };
  
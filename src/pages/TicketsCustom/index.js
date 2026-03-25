import React from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Hidden } from "@material-ui/core";

import TicketsManager from "../../components/TicketsManagerTabs/";
import Ticket from "../../components/Ticket/";

import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
  chatContainer: {
    flex: 1,
    padding: "2px",
    height: `calc(100% - 48px)`,
    overflowY: "hidden"
  },
  chatPapper: {
    display: "flex",
    height: "100%"
  },
  contactsWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden"
  },
  messagesWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column"
  },
  welcomeMsg: {
    background: theme.palette.tabHeaderBackground,
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "100%",
    textAlign: "center"
  }
}));

const TicketsCustom = () => {
  const classes = useStyles();
  const { ticketId } = useParams();

  return (
    <div className={classes.chatContainer}>
      <div className={classes.chatPapper}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={4} className={classes.contactsWrapper}>
            <TicketsManager />
          </Grid>

          <Grid item xs={12} md={8} className={classes.messagesWrapper}>
            {ticketId ? (
              <Ticket key={ticketId} />
            ) : (
              <Hidden only={["sm", "xs"]}>
                <Paper square variant="outlined" className={classes.welcomeMsg}>
                  <span>{i18n.t("chat.noTicketMessage")}</span>
                </Paper>
              </Hidden>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TicketsCustom;
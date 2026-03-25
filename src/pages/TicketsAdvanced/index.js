import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import ChatIcon from "@material-ui/icons/Chat";

import TicketsManagerTabs from "../../components/TicketsManagerTabs/";
import Ticket from "../../components/Ticket/";
import TicketAdvancedLayout from "../../components/TicketAdvancedLayout";

import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
  header: {},
  content: {
    overflow: "auto"
  },
  placeholderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    background: theme.palette.tabHeaderBackground
  },
  placeholderItem: {}
}));

const TicketAdvanced = () => {
  const classes = useStyles();
  const { ticketId } = useParams();
  const [option, setOption] = useState(0);

  // ✅ SOLO controla UI — no context writes
  useEffect(() => {
    if (!ticketId) {
      setOption(1);
    } else {
      setOption(0);
    }
  }, [ticketId]);

  const renderPlaceholder = () => (
    <Box className={classes.placeholderContainer}>
      <div className={classes.placeholderItem}>
        {i18n.t("chat.noTicketMessage")}
      </div>
      <br />
      <Button
        onClick={() => setOption(1)}
        variant="contained"
        color="primary"
      >
        Seleccionar Ticket
      </Button>
    </Box>
  );

  const renderMessageContext = () => {
    if (!ticketId) return renderPlaceholder();
    return <Ticket key={ticketId} />;
  };

  return (
    <TicketAdvancedLayout>
      <Box className={classes.header}>
        <BottomNavigation
          value={option}
          onChange={(event, newValue) => setOption(newValue)}
          showLabels
        >
          <BottomNavigationAction label="Ticket" icon={<ChatIcon />} />
          <BottomNavigationAction label="Servicios" icon={<QuestionAnswerIcon />} />
        </BottomNavigation>
      </Box>

      <Box className={classes.content}>
        {option === 0 ? renderMessageContext() : <TicketsManagerTabs />}
      </Box>
    </TicketAdvancedLayout>
  );
};

export default TicketAdvanced;

import React, { useContext, useEffect, useRef, useState } from "react";

import { useParams, useHistory } from "react-router-dom";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  TextField,
  Container,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import { UsersFilter } from "../../components/UsersFilter";
import api from "../../services/api";
import { socketConnection } from "../../services/socket";

import { has, isObject } from "lodash";

import { AuthContext } from "../../context/Auth/AuthContext";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import { i18n } from "../../translate/i18n";

// Ícones modernos
import ChatIcon from "@material-ui/icons/Chat";
import AddIcon from "@material-ui/icons/Add";
import MessageIcon from "@material-ui/icons/Message";
import GroupIcon from "@material-ui/icons/Group";
import CloseIcon from "@material-ui/icons/Close";

// ================================
// PALETA DE CORES E ESTILOS MODERNOS
// ================================
const colorPalette = {
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a"
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8"
  },
  success: {
    500: "#059669",
    600: "#047857"
  },
  danger: {
    500: "#dc2626",
    600: "#b91c1c"
  }
};

const gradientUtils = {
  headerSlate: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
  buttonPrimary: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  buttonPrimaryHover: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
  buttonDanger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  slate: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
};

const shadows = {
  md: "0 8px 30px rgba(0,0,0,0.08)",
  lg: "0 20px 60px rgba(0,0,0,0.15)",
  colored: {
    blue: "0 8px 30px rgba(59, 130, 246, 0.15)",
    slate: "0 20px 60px rgba(100, 116, 139, 0.2)"
  }
};

const useStyles = makeStyles((theme) => ({
  // Layout principal moderno
  pageBackground: {
    backgroundColor: colorPalette.slate[100],
    minHeight: "100vh"
  },
  
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    maxWidth: "1400px",
  },

  // Header moderno
  header: {
    marginBottom: theme.spacing(4),
    background: gradientUtils.headerSlate,
    borderRadius: "24px",
    padding: theme.spacing(4),
    color: "white",
    boxShadow: shadows.colored.slate,
    position: "relative",
    overflow: "hidden",
    "&:before": {
      content: '""',
      position: "absolute",
      top: "-50%",
      right: "-10%",
      width: "100px",
      height: "100px",
      background: "rgba(255,255,255,0.08)",
      borderRadius: "50%",
      transform: "scale(3)",
    },
  },

  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
  },

  headerIcon: {
    fontSize: "52px",
    opacity: 0.9,
  },

  headerTitle: {
    fontWeight: 700,
    fontSize: "32px",
    marginBottom: theme.spacing(0.5),
  },

  headerSubtitle: {
    opacity: 0.9,
    fontSize: "16px",
    fontWeight: 400,
  },

  // Botão novo chat no header
  newChatButton: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: theme.spacing(1.5, 3),
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    "&:hover": {
      background: "rgba(255,255,255,0.25)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    },
  },

  // Container principal do chat
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: "calc(100vh - 280px)",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: shadows.md,
    backgroundColor: "white",
  },

  // Grid container modernizado
  gridContainer: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
  },

  gridItem: {
    height: "100%",
    position: "relative",
  },

  gridItemTab: {
    height: "92%",
    width: "100%",
  },

  // Seção esquerda (lista de chats)
  chatListSection: {
    backgroundColor: colorPalette.slate[50],
    borderRight: `1px solid ${colorPalette.slate[200]}`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },

  chatListHeader: {
    padding: theme.spacing(3),
    backgroundColor: "white",
    borderBottom: `1px solid ${colorPalette.slate[200]}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chatListTitle: {
    fontWeight: 700,
    color: colorPalette.slate[800],
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },

  // Seção direita (mensagens)
  messagesSection: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
  },

  messagesHeader: {
    padding: theme.spacing(3),
    backgroundColor: "white",
    borderBottom: `1px solid ${colorPalette.slate[200]}`,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },

  // Tabs modernizados
  modernTabs: {
    backgroundColor: "white",
    borderBottom: `1px solid ${colorPalette.slate[200]}`,
    "& .MuiTabs-root": {
      minHeight: "64px",
    },
    "& .MuiTab-root": {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "16px",
      minHeight: "64px",
      color: colorPalette.slate[600],
      "&.Mui-selected": {
        color: colorPalette.blue[600],
      }
    },
    "& .MuiTabs-indicator": {
      height: "3px",
      borderRadius: "3px",
      background: gradientUtils.buttonPrimary,
    }
  },

  // Botões modernos
  modernButton: {
    background: gradientUtils.buttonPrimary,
    borderRadius: "12px",
    padding: theme.spacing(1.5, 3),
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    fontSize: "14px",
    boxShadow: shadows.colored.blue,
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    "&:hover": {
      background: gradientUtils.buttonPrimaryHover,
      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
      transform: "translateY(-2px)",
    },
  },

  // Modal modernizado
  modernDialog: {
    "& .MuiDialog-paper": {
      borderRadius: "20px",
      padding: theme.spacing(2),
      minWidth: "500px",
    }
  },

  modernDialogTitle: {
    backgroundColor: colorPalette.slate[50],
    borderRadius: "16px",
    margin: theme.spacing(2),
    padding: theme.spacing(3),
    fontWeight: 700,
    fontSize: "24px",
    color: colorPalette.slate[800],
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },

  modernDialogContent: {
    padding: theme.spacing(3),
  },

  modernTextField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: colorPalette.slate[50],
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: colorPalette.slate[100],
      },
      "&.Mui-focused": {
        backgroundColor: "white",
        boxShadow: shadows.colored.blue,
      }
    },
    "& .MuiInputLabel-root": {
      color: colorPalette.slate[500],
      fontWeight: 500,
    },
  },

  modernDialogActions: {
    padding: theme.spacing(3),
    gap: theme.spacing(2),
  },

  cancelButton: {
    color: colorPalette.slate[600],
    borderColor: colorPalette.slate[300],
    borderRadius: "12px",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": {
      backgroundColor: colorPalette.slate[50],
      borderColor: colorPalette.slate[400],
    }
  },

  saveButton: {
    background: gradientUtils.buttonPrimary,
    borderRadius: "12px",
    fontWeight: 600,
    textTransform: "none",
    color: "white",
    "&:hover": {
      background: gradientUtils.buttonPrimaryHover,
    },
    "&:disabled": {
      background: colorPalette.slate[300],
      color: colorPalette.slate[500],
    }
  },

  // Estados especiais
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: colorPalette.slate[500],
    padding: theme.spacing(4),
  },

  emptyIcon: {
    fontSize: "80px",
    marginBottom: theme.spacing(2),
    opacity: 0.3,
  },

  // Animações
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" }
  },

  fadeIn: {
    animation: "$fadeIn 0.5s ease-out"
  },

  // Responsivo para mobile
  mobileContainer: {
    padding: theme.spacing(2),
  },

  // Scrollbar customizado
  scrollableContent: {
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: colorPalette.slate[100],
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: colorPalette.slate[300],
      borderRadius: "4px",
      "&:hover": {
        background: colorPalette.slate[400],
      }
    }
  }
}));

// ================================
// MODAL MODERNIZADO
// ================================
export function ChatModal({
  open,
  chat,
  type,
  handleClose,
  handleLoadNewChat,
}) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle("");
    setUsers([]);
    if (type === "edit") {
      const userList = chat.users.map((u) => ({
        id: u.user.id,
        name: u.user.name,
      }));
      setUsers(userList);
      setTitle(chat.title);
    }
  }, [chat, open, type]);

  const handleSave = async () => {
    try {
      if (type === "edit") {
        await api.put(`/chats/${chat.id}`, {
          users,
          title,
        });
      } else {
        const { data } = await api.post("/chats", {
          users,
          title,
        });
        handleLoadNewChat(data);
      }
      handleClose();
    } catch (err) { }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes.modernDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className={classes.modernDialogTitle}>
        <ChatIcon />
        {type === "edit" ? "Editar Chat" : i18n.t("chatInternal.modal.title")}
        <IconButton
          onClick={handleClose}
          style={{ 
            marginLeft: "auto",
            color: colorPalette.slate[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className={classes.modernDialogContent}>
        <Grid spacing={3} container>
          <Grid xs={12} item>
            <TextField
              className={classes.modernTextField}
              label="Título do Chat"
              placeholder="Digite o título do chat"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid xs={12} item>
            <Typography 
              variant="subtitle1" 
              style={{ 
                marginBottom: 16,
                fontWeight: 600,
                color: colorPalette.slate[700]
              }}
            >
              Participantes
            </Typography>
            <UsersFilter
              onFiltered={(users) => setUsers(users)}
              initialUsers={users}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions className={classes.modernDialogActions}>
        <Button 
          onClick={handleClose} 
          className={classes.cancelButton}
          variant="outlined"
        >
          {i18n.t("chatInternal.modal.cancel")}
        </Button>
        <Button 
          onClick={handleSave} 
          className={classes.saveButton}
          variant="contained"
          disabled={users===undefined || users.length === 0 || title === null || title === "" || title === undefined}
        >
          {i18n.t("chatInternal.modal.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ================================
// COMPONENTE PRINCIPAL
// ================================
function Chat(props) {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const history = useHistory();

  // Estados originais mantidos
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState("new");
  const [currentChat, setCurrentChat] = useState({});
  const [chats, setChats] = useState([]);
  const [chatsPageInfo, setChatsPageInfo] = useState({ hasMore: false });
  const [messages, setMessages] = useState([]);
  const [messagesPageInfo, setMessagesPageInfo] = useState({ hasMore: false });
  const [messagesPage, setMessagesPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const isMounted = useRef(true);
  const scrollToBottomRef = useRef();
  const { id } = useParams();

  // Todas as funções originais mantidas
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      findChats().then((data) => {
        const { records } = data;
        if (records.length > 0) {
          setChats(records);
          setChatsPageInfo(data);

          if (id && records.length) {
            const chat = records.find((r) => r.uuid === id);
            selectChat(chat);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isObject(currentChat) && has(currentChat, "id")) {
      findMessages(currentChat.id).then(() => {
        if (typeof scrollToBottomRef.current === "function") {
          setTimeout(() => {
            scrollToBottomRef.current();
          }, 300);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat]);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on(`company-${companyId}-chat-user-${user.id}`, (data) => {
      if (data.action === "create") {
        setChats((prev) => [data.record, ...prev]);
      }
      if (data.action === "update") {
        const changedChats = chats.map((chat) => {
          if (chat.id === data.record.id) {
            setCurrentChat(data.record);
            return {
              ...data.record,
            };
          }
          return chat;
        });
        setChats(changedChats);
      }
    });

    socket.on(`company-${companyId}-chat`, (data) => {
      if (data.action === "delete") {
        const filteredChats = chats.filter((c) => c.id !== +data.id);
        setChats(filteredChats);
        setMessages([]);
        setMessagesPage(1);
        setMessagesPageInfo({ hasMore: false });
        setCurrentChat({});
        history.push("/chats");
      }
    });

    if (isObject(currentChat) && has(currentChat, "id")) {
      socket.on(`company-${companyId}-chat-${currentChat.id}`, (data) => {
        if (data.action === "new-message") {
          setMessages((prev) => [...prev, data.newMessage]);
          const changedChats = chats.map((chat) => {
            if (chat.id === data.newMessage.chatId) {
              return {
                ...data.chat,
              };
            }
            return chat;
          });
          setChats(changedChats);
          scrollToBottomRef.current();
        }

        if (data.action === "update") {
          const changedChats = chats.map((chat) => {
            if (chat.id === data.chat.id) {
              return {
                ...data.chat,
              };
            }
            return chat;
          });
          setChats(changedChats);
          scrollToBottomRef.current();
        }
      });
    }

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat]);

  const selectChat = (chat) => {
    try {
      setMessages([]);
      setMessagesPage(1);
      setCurrentChat(chat);
      localStorage.setItem("currentChat", JSON.stringify(chat));
      setTab(1);
    } catch (err) { }
  };

  const sendMessage = async (contentMessage) => {
    setLoading(true);
    try {
      await api.post(`/chats/${currentChat.id}/messages`, {
        message: contentMessage,
      });
    } catch (err) { }
    setLoading(false);
  };

  const deleteChat = async (chat) => {
    try {
      await api.delete(`/chats/${chat.id}`);
    } catch (err) { }
  };

  const findMessages = async (chatId) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/chats/${chatId}/messages?pageNumber=${messagesPage}`
      );
      setMessagesPage((prev) => prev + 1);
      setMessagesPageInfo(data);
      setMessages((prev) => [...data.records, ...prev]);
    } catch (err) { }
    setLoading(false);
  };

  const loadMoreMessages = async () => {
    if (!loading) {
      findMessages(currentChat.id);
    }
  };

  const findChats = async () => {
    try {
      const { data } = await api.get("/chats");
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  // Render para desktop (grid)
  const renderGrid = () => {
    return (
      <Grid className={classes.gridContainer} container>
        {/* Lista de Chats - Coluna Esquerda */}
        <Grid className={classes.gridItem} md={4} item>
          <div className={classes.chatListSection}>
            <div className={classes.chatListHeader}>
              <Typography className={classes.chatListTitle}>
                <GroupIcon />
                Conversas ({chats.length})
              </Typography>
              <Button
                className={classes.modernButton}
                onClick={() => {
                  setDialogType("new");
                  setShowDialog(true);
                }}
                size="small"
              >
                <AddIcon />
                Novo
              </Button>
            </div>
            <div className={classes.scrollableContent} style={{ flex: 1, overflow: "auto" }}>
              <ChatList
                chats={chats}
                pageInfo={chatsPageInfo}
                loading={loading}
                handleSelectChat={(chat) => selectChat(chat)}
                handleDeleteChat={(chat) => deleteChat(chat)}
                handleEditChat={() => {
                  setDialogType("edit");
                  setShowDialog(true);
                }}
              />
            </div>
          </div>
        </Grid>

        {/* Mensagens - Coluna Direita */}
        <Grid className={classes.gridItem} md={8} item>
          <div className={classes.messagesSection}>
            {isObject(currentChat) && has(currentChat, "id") ? (
              <>
                <div className={classes.messagesHeader}>
                  <MessageIcon style={{ color: colorPalette.blue[600] }} />
                  <div>
                    <Typography variant="h6" style={{ fontWeight: 700 }}>
                      {currentChat.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {currentChat.users?.length} participantes
                    </Typography>
                  </div>
                </div>
                <ChatMessages
                  chat={currentChat}
                  scrollToBottomRef={scrollToBottomRef}
                  pageInfo={messagesPageInfo}
                  messages={messages}
                  loading={loading}
                  handleSendMessage={sendMessage}
                  handleLoadMore={loadMoreMessages}
                />
              </>
            ) : (
              <div className={classes.emptyState}>
                <ChatIcon className={classes.emptyIcon} />
                <Typography variant="h6" style={{ marginBottom: 8 }}>
                  Selecione uma conversa
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Escolha um chat da lista para visualizar as mensagens
                </Typography>
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    );
  };

  // Render para mobile (tabs)
  const renderTab = () => {
    return (
      <Grid className={classes.gridContainer} container>
        <Grid md={12} item>
          <div className={classes.modernTabs}>
            <Tabs
              value={tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={(e, v) => setTab(v)}
              variant="fullWidth"
            >
              <Tab label={`Chats (${chats.length})`} icon={<GroupIcon />} />
              <Tab 
                label="Mensagens" 
                icon={<MessageIcon />}
                disabled={!isObject(currentChat) || !has(currentChat, "id")}
              />
            </Tabs>
          </div>
        </Grid>

        {tab === 0 && (
          <Grid className={classes.gridItemTab} md={12} item>
            <div className={classes.chatListHeader}>
              <Typography className={classes.chatListTitle}>
                <GroupIcon />
                Suas Conversas
              </Typography>
              <Button
                className={classes.modernButton}
                onClick={() => {
                  setDialogType("new");
                  setShowDialog(true);
                }}
                size="small"
              >
                <AddIcon />
                Novo
              </Button>
            </div>
            <div className={classes.scrollableContent} style={{ flex: 1, overflow: "auto" }}>
              <ChatList
                chats={chats}
                pageInfo={chatsPageInfo}
                loading={loading}
                handleSelectChat={(chat) => selectChat(chat)}
                handleDeleteChat={(chat) => deleteChat(chat)}
                handleEditChat={() => {
                  setDialogType("edit");
                  setShowDialog(true);
                }}
              />
            </div>
          </Grid>
        )}

        {tab === 1 && (
          <Grid className={classes.gridItemTab} md={12} item>
            {isObject(currentChat) && has(currentChat, "id") ? (
              <ChatMessages
                chat={currentChat}
                scrollToBottomRef={scrollToBottomRef}
                pageInfo={messagesPageInfo}
                messages={messages}
                loading={loading}
                handleSendMessage={sendMessage}
                handleLoadMore={loadMoreMessages}
              />
            ) : (
              <div className={classes.emptyState}>
                <ChatIcon className={classes.emptyIcon} />
                <Typography variant="h6">
                  Nenhuma conversa selecionada
                </Typography>
              </div>
            )}
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <div className={classes.pageBackground}>
      <Container maxWidth="xl" className={classes.container}>
        
        {/* Modal Modernizado */}
        <ChatModal
          type={dialogType}
          open={showDialog}
          chat={currentChat}
          handleLoadNewChat={(data) => {
            setMessages([]);
            setMessagesPage(1);
            setCurrentChat(data);
            setTab(1);
            history.push(`/chats/${data.uuid}`);
          }}
          handleClose={() => setShowDialog(false)}
        />

        {/* Header Moderno */}
        <Box className={`${classes.header} ${classes.fadeIn}`}>
          <div className={classes.headerContent}>
            <div className={classes.headerLeft}>
              <ChatIcon className={classes.headerIcon} />
              <div>
                <Typography className={classes.headerTitle}>
                  Chat Interno
                </Typography>
                <Typography className={classes.headerSubtitle}>
                  Comunicação interna da equipe em tempo real
                </Typography>
              </div>
            </div>
            
            {/* Botão Novo Chat no Header (apenas desktop) */}
            {isWidthUp("md", props.width) && (
              <Button
                className={classes.newChatButton}
                onClick={() => {
                  setDialogType("new");
                  setShowDialog(true);
                }}
              >
                <AddIcon />
                Novo Chat
              </Button>
            )}
          </div>
        </Box>

        {/* Container Principal Modernizado */}
        <Paper className={`${classes.mainContainer} ${classes.fadeIn}`} elevation={0}>
          {isWidthUp("md", props.width) ? renderGrid() : renderTab()}
        </Paper>

      </Container>
    </div>
  );
}

export default withWidth()(Chat);
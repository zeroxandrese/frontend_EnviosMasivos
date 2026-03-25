import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, Paper, Typography, Modal, IconButton } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Chip from "@material-ui/core/Chip";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import HelpIcon from "@material-ui/icons/Help";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import CloseIcon from "@material-ui/icons/Close";
import InfoIcon from "@material-ui/icons/Info";

import { i18n } from "../../translate/i18n";
import useHelps from "../../hooks/useHelps";

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
    padding: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(4),
    background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    borderRadius: "24px",
    padding: theme.spacing(4),
    color: "white",
    boxShadow: "0 20px 60px rgba(100, 116, 139, 0.2)",
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
    gap: theme.spacing(3),
    position: "relative",
    zIndex: 1,
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
  infoSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  infoTitle: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    color: "#1e293b",
    fontWeight: 700,
    fontSize: "20px",
  },
  infoText: {
    color: "#64748b",
    fontSize: "16px",
    lineHeight: 1.6,
  },
  statsContainer: {
    background: "white",
    borderRadius: "16px",
    padding: theme.spacing(2, 3),
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(4),
  },
  statsText: {
    color: "#64748b",
    fontWeight: 600,
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  videoCount: {
    color: "#3b82f6",
    fontWeight: 700,
    fontSize: "18px",
  },
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: theme.spacing(4),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  videoCard: {
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
      "& $playOverlay": {
        opacity: 1,
        transform: "scale(1)",
      },
    },
  },
  videoThumbnailContainer: {
    position: "relative",
    overflow: "hidden",
  },
  videoThumbnail: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    transition: "transform 0.3s ease",
  },
  playOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.8)",
    opacity: 0,
    transition: "all 0.3s ease",
    background: "rgba(0,0,0,0.7)",
    borderRadius: "50%",
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: "48px",
    color: "white",
  },
  videoContent: {
    padding: theme.spacing(3),
    background: "white",
  },
  videoTitle: {
    fontWeight: 700,
    fontSize: "18px",
    color: "#1e293b",
    marginBottom: theme.spacing(2),
    lineHeight: 1.4,
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
  },
  videoDescription: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.5,
    display: "-webkit-box",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    marginBottom: theme.spacing(2),
  },
  videoChip: {
    backgroundColor: "#e0f2fe",
    color: "#0277bd",
    fontWeight: 600,
    fontSize: "12px",
  },
  videoModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  videoModalContent: {
    outline: 'none',
    width: '95%',
    maxWidth: '1200px',
    aspectRatio: '16/9',
    position: 'relative',
    backgroundColor: '#000',
    borderRadius: "16px",
    overflow: 'hidden',
    boxShadow: "0 25px 100px rgba(0,0,0,0.5)",
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    zIndex: 10,
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.9)",
    },
  },
  emptyState: {
    textAlign: "center",
    padding: theme.spacing(8),
    color: "#64748b",
  },
  emptyIcon: {
    fontSize: "80px",
    color: "#cbd5e1",
    marginBottom: theme.spacing(3),
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: theme.spacing(2),
  },
  emptyDescription: {
    fontSize: "16px",
    color: "#64748b",
  },
}));

const Helps = () => {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const { list } = useHelps();
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const helps = await list();
      setRecords(helps);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const handleModalClose = useCallback((event) => {
    if (event.key === "Escape") {
      closeVideoModal();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleModalClose);
    return () => {
      document.removeEventListener("keydown", handleModalClose);
    };
  }, [handleModalClose]);

  const renderVideoModal = () => {
    return (
      <Modal
        open={Boolean(selectedVideo)}
        onClose={closeVideoModal}
        className={classes.videoModal}
      >
        <div className={classes.videoModalContent}>
          <IconButton 
            className={classes.closeButton}
            onClick={closeVideoModal}
            size="small"
          >
            <CloseIcon />
          </IconButton>
          {selectedVideo && (
            <iframe
              style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
              src={`https://www.youtube.com/embed/${selectedVideo}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </Modal>
    );
  };

  const renderHelps = () => {
    if (!records.length) {
      return (
        <div className={classes.emptyState}>
          <VideoLibraryIcon className={classes.emptyIcon} />
          <Typography className={classes.emptyTitle}>
            Nenhum vídeo de ajuda disponível
          </Typography>
          <Typography className={classes.emptyDescription}>
            Os vídeos de ajuda aparecerão aqui quando estiverem disponíveis
          </Typography>
        </div>
      );
    }

    return (
      <div className={classes.videosGrid}>
        {records.map((record, key) => (
          <Card 
            key={key} 
            className={classes.videoCard}
            onClick={() => openVideoModal(record.video)}
          >
            <div className={classes.videoThumbnailContainer}>
              <img
                src={`https://img.youtube.com/vi/${record.video}/mqdefault.jpg`}
                alt="Thumbnail"
                className={classes.videoThumbnail}
              />
              <div className={classes.playOverlay}>
                <PlayCircleOutlineIcon className={classes.playIcon} />
              </div>
            </div>
            
            <CardContent className={classes.videoContent}>
              <Typography className={classes.videoTitle}>
                {record.title}
              </Typography>
              <Typography className={classes.videoDescription}>
                {record.description}
              </Typography>
              <Chip
                label="Vídeo Tutorial"
                size="small"
                className={classes.videoChip}
                icon={<VideoLibraryIcon style={{ fontSize: 16 }} />}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={classes.mainContainer}>
      <Container maxWidth="xl">
        {/* Header Modernizado */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <HelpIcon className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                Central de Ajuda
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Vídeos tutoriais e guias para utilizar o sistema
              </Typography>
            </div>
          </div>
        </Box>

        {/* Seção de Informações */}
        <Paper className={classes.infoSection} elevation={0}>
          <Typography className={classes.infoTitle}>
            <InfoIcon style={{ marginRight: 12 }} />
            Sobre os Tutoriais
          </Typography>
          <Typography className={classes.infoText}>
            Esta seção contém vídeos tutoriais que irão ajudá-lo a utilizar todas as funcionalidades 
            do sistema de forma eficiente. Clique em qualquer vídeo para assisti-lo em tela cheia.
          </Typography>
        </Paper>

        {/* Contador de Vídeos */}
        {records.length > 0 && (
          <Box className={classes.statsContainer}>
            <Typography className={classes.statsText}>
              <VideoLibraryIcon />
              Total de Vídeos Disponíveis: 
              <span className={classes.videoCount}>{records.length}</span>
            </Typography>
          </Box>
        )}

        {/* Grid de Vídeos */}
        <Paper 
          elevation={0}
          style={{
            backgroundColor: "transparent",
            boxShadow: "none"
          }}
        >
          {renderHelps()}
        </Paper>

        {/* Modal de Vídeo */}
        {renderVideoModal()}
      </Container>
    </div>
  );
};

export default Helps;
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import LabelIcon from "@material-ui/icons/Label";
import AddIcon from "@material-ui/icons/Add";
import FilterListIcon from "@material-ui/icons/FilterList";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import TagModal from "../../components/TagModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Chip } from "@material-ui/core";
import { AuthContext } from "../../context/Auth/AuthContext";

// ================================
// PALETA DE CORES E ESTILOS MODERNOS
// ================================
const colorPalette = {
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
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
    600: "#047857",
    700: "#065f46"
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

// ================================
// ESTILOS MODERNOS
// ================================
const useStyles = makeStyles((theme) => ({
  // Layout principal
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

  // Seção de filtros/busca
  filtersSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: shadows.md,
    border: `1px solid ${colorPalette.slate[200]}`,
  },

  filtersTitle: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(3),
    color: colorPalette.slate[800],
    fontWeight: 700,
    fontSize: "20px",
  },

  filtersContent: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
    flexWrap: "wrap"
  },

  // Campo de busca moderno
  searchField: {
    flex: 1,
    minWidth: "300px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      backgroundColor: colorPalette.slate[50],
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: colorPalette.slate[100],
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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

  // Botão adicionar moderno
  addButton: {
    background: gradientUtils.buttonPrimary,
    borderRadius: "16px",
    padding: theme.spacing(2, 4),
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    minHeight: "56px",
    fontSize: "16px",
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

  // Tabela moderna
  tableCard: {
    borderRadius: "20px",
    boxShadow: shadows.md,
    border: "none",
    overflow: "hidden",
    backgroundColor: "white"
  },

  modernTable: {
    "& .MuiTableHead-root": {
      background: gradientUtils.slate,
    },
    "& .MuiTableCell-head": {
      fontWeight: 700,
      color: colorPalette.slate[800],
      borderBottom: `2px solid ${colorPalette.slate[200]}`,
      fontSize: "16px",
      padding: theme.spacing(3, 2),
    },
    "& .MuiTableRow-root:nth-child(even)": {
      backgroundColor: colorPalette.slate[50],
    },
    "& .MuiTableRow-root": {
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: `${colorPalette.blue[50]} !important`,
        transform: "scale(1.01)",
      }
    },
    "& .MuiTableCell-root": {
      borderBottom: `1px solid ${colorPalette.slate[200]}`,
      padding: theme.spacing(2.5, 2),
      fontSize: "14px",
    },
  },

  // Chip de tag modernizado
  modernChip: {
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "13px",
    padding: theme.spacing(1, 2),
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    border: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    }
  },

  // Botões de ação modernos
  actionButton: {
    borderRadius: "12px",
    padding: theme.spacing(1),
    margin: theme.spacing(0, 0.5),
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }
  },

  editButton: {
    color: colorPalette.blue[600],
    "&:hover": {
      backgroundColor: colorPalette.blue[50],
      color: colorPalette.blue[700],
    }
  },

  deleteButton: {
    color: colorPalette.danger[500],
    "&:hover": {
      backgroundColor: "#fee2e2",
      color: colorPalette.danger[600],
    }
  },

  // Estados especiais
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(8),
  },

  emptyState: {
    textAlign: "center",
    padding: theme.spacing(8),
    color: colorPalette.slate[500],
  },

  emptyIcon: {
    fontSize: "80px",
    marginBottom: theme.spacing(2),
    opacity: 0.3,
  },

  // Contador de resultados
  resultsCounter: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: colorPalette.slate[600],
    fontWeight: 600,
    fontSize: "14px",
    marginBottom: theme.spacing(2),
  },

  // Scrollbar customizado
  mainPaper: {
    flex: 1,
    overflowY: "auto",
    maxHeight: "calc(100vh - 300px)",
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
  },

  // Animações
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" }
  },

  fadeIn: {
    animation: "$fadeIn 0.5s ease-out"
  }
}));

const Tags = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  // ================================
  // MEDIDA SEVERA: ESTADOS ULTRA SIMPLES
  // ================================
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [deletingTag, setDeletingTag] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ================================
  // MEDIDA SEVERA: FETCH BRUTALMENTE SIMPLES
  // ================================
  const fetchAllTags = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching ALL tags...");
      
      const { data } = await api.get("/tags/", {
        params: { 
          searchParam, 
          offset: 0,
          limit: 1000, // Busca TODAS as tags de uma vez
          kanban: 0 
        },
      });
      
      console.log("✅ Tags fetched:", data.tags?.length || 0);
      setTags(data.tags || []);
      setLoading(false);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setLoading(false);
      toastError(err);
    }
  }, [searchParam]);

  // ================================
  // MEDIDA SEVERA: RECARREGA SEMPRE QUE MUDA BUSCA OU REFRESH TRIGGER
  // ================================
  useEffect(() => {
    fetchAllTags();
  }, [searchParam, refreshTrigger, fetchAllTags]);

  // ================================
  // MEDIDA SEVERA: FORÇA REFRESH BRUTAL
  // ================================
  const forceRefresh = useCallback(() => {
    console.log("🚨 FORCE REFRESH TRIGGERED");
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // ================================
  // HANDLERS ULTRA SIMPLES
  // ================================
  const handleOpenTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setTagModalOpen(true);
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await api.delete(`/tags/${tagId}`);
      toast.success(i18n.t("tags.toasts.deleted"));
      // MEDIDA SEVERA: FORÇA REFRESH IMEDIATO
      forceRefresh();
    } catch (err) {
      toastError(err);
    }
    setDeletingTag(null);
    setConfirmModalOpen(false);
  };

  // ================================
  // MEDIDA SEVERA: RELOAD OBRIGATÓRIO COM DELAY MÍNIMO
  // ================================
  const handleTagModalReload = useCallback(() => {
    console.log("🔄 Modal reload - FORCING REFRESH");
    
    // Delay mínimo e refresh obrigatório
    setTimeout(() => {
      forceRefresh();
    }, 200);
  }, [forceRefresh]);

  return (
    <div className={classes.pageBackground}>
      <Container maxWidth="xl" className={classes.container}>
        
        {/* Modais */}
        <ConfirmationModal
          title={deletingTag && `${i18n.t("tags.confirmationModal.deleteTitle")}`}
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={() => handleDeleteTag(deletingTag.id)}
        >
          {i18n.t("tags.confirmationModal.deleteMessage")}
        </ConfirmationModal>
        
        <TagModal
          open={tagModalOpen}
          onClose={handleCloseTagModal}
          reload={handleTagModalReload}
          aria-labelledby="form-dialog-title"
          tagId={selectedTag && selectedTag.id}
          kanban={0}
        />

        {/* Header Moderno */}
        <Box className={`${classes.header} ${classes.fadeIn}`}>
          <div className={classes.headerContent}>
            <LabelIcon className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                {i18n.t("tags.title")}
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Gerencie as etiquetas do sistema de forma eficiente
              </Typography>
            </div>
          </div>
        </Box>

        {/* Seção de Filtros Modernizada */}
        <Paper className={`${classes.filtersSection} ${classes.fadeIn}`} elevation={0}>
          <Typography className={classes.filtersTitle}>
            <FilterListIcon style={{ marginRight: 12 }} />
            Pesquisa e Ações
          </Typography>
          
          <div className={classes.filtersContent}>
            <TextField
              className={classes.searchField}
              placeholder={i18n.t("contacts.searchPlaceholder")}
              type="search"
              value={searchParam}
              onChange={handleSearch}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: colorPalette.slate[400] }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              className={classes.addButton}
              onClick={handleOpenTagModal}
            >
              <AddIcon />
              {i18n.t("tags.buttons.add")}
            </Button>

            {/* BOTÃO DE REFRESH MANUAL PARA EMERGÊNCIA */}
            <Button
              onClick={forceRefresh}
              variant="outlined"
              style={{ 
                minHeight: "56px", 
                borderColor: colorPalette.slate[300],
                color: colorPalette.slate[600] 
              }}
            >
              🔄 Atualizar
            </Button>
          </div>

          {/* Contador de Resultados */}
          <div className={classes.resultsCounter}>
            <LabelIcon style={{ fontSize: "18px" }} />
            Total: {tags.length} {tags.length === 1 ? 'etiqueta' : 'etiquetas'}
            {loading && " (carregando...)"}
          </div>
        </Paper>

        {/* Tabela Modernizada */}
        <Paper className={`${classes.tableCard} ${classes.fadeIn}`} elevation={0}>
          <div className={classes.mainPaper}>
            <Table className={classes.modernTable} size="medium">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <LabelIcon />
                      {i18n.t("tags.table.name")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <SearchIcon />
                      {i18n.t("tags.table.contacts")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {i18n.t("tags.table.actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id} className={classes.fadeIn}>
                    <TableCell align="center">
                      <Chip
                        className={classes.modernChip}
                        style={{
                          backgroundColor: tag.color || '#3b82f6',
                          color: "white",
                        }}
                        label={tag.name || 'Nome não disponível'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <Typography variant="body1" style={{ fontWeight: 600 }}>
                          {tag.contactsCount || 0}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {(tag.contactsCount || 0) === 1 ? 'contato' : 'contatos'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        className={`${classes.actionButton} ${classes.editButton}`}
                        onClick={() => handleEditTag(tag)}
                        title="Editar etiqueta"
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        className={`${classes.actionButton} ${classes.deleteButton}`}
                        onClick={(e) => {
                          setConfirmModalOpen(true);
                          setDeletingTag(tag);
                        }}
                        title="Excluir etiqueta"
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {loading && <TableRowSkeleton columns={3} />}

                {/* Estado vazio quando não há tags */}
                {!loading && tags.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className={classes.emptyState}>
                      <LabelIcon className={classes.emptyIcon} />
                      <Typography variant="h6" style={{ marginBottom: 8 }}>
                        {searchParam ? 'Nenhuma etiqueta encontrada' : 'Nenhuma etiqueta cadastrada'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {searchParam 
                          ? 'Tente ajustar os termos da pesquisa'
                          : 'Comece criando sua primeira etiqueta'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Paper>

      </Container>
    </div>
  );
};

export default Tags;
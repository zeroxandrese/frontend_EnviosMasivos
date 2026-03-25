/* eslint-disable no-console */
import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Box, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import { ChevronLeft } from '@material-ui/icons';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import AssessmentIcon from '@material-ui/icons/Assessment';
import EventIcon from '@material-ui/icons/Event';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Pagination } from '@material-ui/lab';
import { pdf } from '@react-pdf/renderer';
import chillout from 'chillout';
import { format, parseISO } from 'date-fns';
import { saveAs } from 'file-saver';

import ExportReport from '../../../components/ExportReport';
import MainContainer from '../../../components/MainContainer';
import MainHeader from '../../../components/MainHeader';
import MainHeaderButtonsWrapper from '../../../components/MainHeaderButtonsWrapper';
import SelectLimitDropdown from '../../../components/SelectLimitDropdown';
import TableRowSkeleton from '../../../components/TableRowSkeleton';
import Title from '../../../components/Title';
import api from '../../../services/api';
import { i18n } from '../../../translate/i18n';
import zipFiles from '../../../utils/zipFiles';

const useStyles = makeStyles((theme) => ({
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
  filtersSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  filtersTitle: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(3),
    color: "#1e293b",
    fontWeight: 700,
    fontSize: "20px",
  },
  mainPaper: {
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    border: "none",
    overflow: "hidden",
    marginBottom: theme.spacing(3),
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  backButton: {
    background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
    borderRadius: "16px",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    padding: theme.spacing(1.5, 3),
    boxShadow: "0 4px 15px rgba(107, 114, 128, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #4b5563 0%, #374151 100%)",
      transform: "translateY(-2px)",
    },
  },
  exportButton: {
    background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    borderRadius: "16px",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    minHeight: "48px",
    padding: theme.spacing(1.5, 3),
    boxShadow: "0 4px 15px rgba(220, 38, 38, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
      transform: "translateY(-2px)",
    },
    "&:disabled": {
      background: "#9ca3af",
      color: "white",
      transform: "none",
    },
  },
  dateField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#64748b",
      fontWeight: 500,
    },
  },
  reportsTable: {
    "& .MuiTableHead-root": {
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    },
    "& .MuiTableCell-head": {
      fontWeight: 700,
      color: "#1e293b",
      borderBottom: "2px solid #e2e8f0",
      fontSize: "14px",
      padding: theme.spacing(2),
    },
    "& .MuiTableRow-root:nth-child(even)": {
      backgroundColor: "#f8fafc",
    },
    "& .MuiTableCell-root": {
      borderBottom: "1px solid #e2e8f0",
      padding: theme.spacing(2),
      fontSize: "14px",
    },
    "& .MuiTableRow-hover:hover": {
      backgroundColor: "#e2e8f0 !important",
    },
  },
  paginationContainer: {
    background: "white",
    borderRadius: "16px",
    padding: theme.spacing(2, 3),
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActionsContainer: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing(2),
  },
  filtersGroup: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    flexWrap: "wrap",
  },
  filterLabel: {
    color: "#64748b",
    fontWeight: 600,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
}));

const TicketsReports = () => {
  const classes = useStyles();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [tickets, setTickets] = useState([]);

  const [dateStartParam, setDateStartParam] = useState('');
  const [dateEndParam, setDateEndParam] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [totalData, setTotalData] = useState(0);

  const [pdfLoading, setPdfLoading] = useState(false);

  const { isLoading } = useQuery(
    ['reports', page, dateStartParam, dateEndParam, perPage],
    async () => {
      const response = await api.get('reports/tickets', {
        params: {
          page,
          perPage,
          dateStartParam,
          dateEndParam,
        },
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setHasMore(data.items.length > 0 ? Number(page) !== data.pages : false);
        setTotalData(data.count);
        setTotalPages(data.pages);
        setTickets(data.items);
      },
    }
  );

  const handlePages = (page) => {
    setPage(page);
  };

  const formateDate = (date) => {
    const parseDate = parseISO(date);
    const data = format(parseDate, " dd'/'MM'/'yyyy '-' HH:mm'h'", {
      timeZone: 'America/Sao_Paulo',
    });
    return data;
  };

  const handleBack = () => {
    history.goBack();
  };

  const handlePdfData = useCallback(async () => {
    try {
      setPdfLoading(true);
      const newDate = new Date().toLocaleDateString('pt-BR');
      const newDateTime = new Date().toLocaleTimeString('pt-BR');
      const date = `${newDate}${newDateTime}`;
      const formattedDate = date.replace(/[\W_]+/g, '');
      
      if (totalData > 1000) {
        toast.info('Generando informe comprimido, espere.');
        const filesArray = [];
        const pdfPages = Math.ceil(totalData / 500);

        await chillout.repeat(pdfPages, async (i) => {
          const pdfPaginatedData = await queryClient.fetchQuery(
            'pdf_data',
            async () => {
              const response = await api.get('reports/tickets', {
                params: {
                  dateStartParam,
                  dateEndParam,
                  page: i + 1,
                  perPage: 500,
                },
              });
              return response.data;
            },
            {
              staleTime: 10000,
            }
          );

          const pdfBlob = await pdf(
            <ExportReport
              tickets={pdfPaginatedData.items}
              formatDate={formateDate}
            />
          ).toBlob();

          filesArray.push({
            file: pdfBlob,
            name: 'tickets_report_' + (i + 1) + '.pdf',
          });
        });

        if (filesArray.length === 1) {
          saveAs(filesArray[0].file, filesArray[0].name);
          setPdfLoading(false);
          return;
        }

        const zip = await zipFiles(filesArray);

        saveAs(zip, `topzap_atenditmentos_${formattedDate}_compact_report.zip`);
        setPdfLoading(false);
        return;
      }

      const data = await queryClient.fetchQuery(
        'pdf_data',
        async () => {
          const response = await api.get('reports/tickets', {
            params: {
              dateStartParam,
              dateEndParam,
              pdf: true,
            },
          });
          return response.data;
        },
        {
          staleTime: 10000,
        }
      );

      const blob = await pdf(
        <ExportReport tickets={data.pdfData} formatDate={formateDate} />
      ).toBlob();
      saveAs(blob, `topzap_atendimentos_${formattedDate}_report.pdf`);

      setPdfLoading(false);
    } catch (error) {
      setPdfLoading(false);
      toast.error('Error al generar el informe');
      console.log(error);
    }
  }, [dateEndParam, dateStartParam, queryClient, totalData]);

  const handleSearch = (event, type) => {
    if (type === 'start') setDateStartParam(event.target.value);
    else setDateEndParam(event.target.value);
  };

  return (
    <div className={classes.mainContainer}>
      <MainContainer>
        {/* Botão Voltar Estilizado */}
        <Box className={classes.toolbarIcon}>
          <Button
            onClick={handleBack}
            className={classes.backButton}
            startIcon={<ChevronLeft />}
          >
            Volver
          </Button>
        </Box>

        {/* Header Modernizado */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <AssessmentIcon className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                Informe de servicio
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Ver y exportar datos de servicio detallados
              </Typography>
            </div>
          </div>
        </Box>

        {/* Filtros e Ações */}
        <Paper className={classes.headerActionsContainer} elevation={0}>
          <div className={classes.filtersGroup}>
            <Typography className={classes.filterLabel}>
              <EventIcon />
              Período:
            </Typography>
            
            <TextField
              label="Data Inicial"
              onChange={(event) => handleSearch(event, 'start')}
              type="date"
              value={dateStartParam}
              className={classes.dateField}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Data Final"
              onChange={(event) => handleSearch(event, 'end')}
              type="date"
              value={dateEndParam}
              className={classes.dateField}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <Button
            disabled={pdfLoading}
            onClick={handlePdfData}
            className={classes.exportButton}
            variant="contained"
            startIcon={pdfLoading ? <GetAppIcon /> : <PdfIcon />}
          >
            {pdfLoading ? (
              <span>Generando PDF...</span>
            ) : (
              <span>{i18n.t('Exportar PDF')}</span>
            )}
          </Button>
        </Paper>

        {/* Tabela de Dados */}
        <Paper className={classes.mainPaper} elevation={0}>
          {isLoading === true && <TableRowSkeleton />}

          {isLoading === false && (
            <Table
              size="medium"
              className={classes.reportsTable}
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Ticket</TableCell>
                  <TableCell align="center">Contacto</TableCell>
                  <TableCell align="center">WhatsApp</TableCell>
                  <TableCell align="center">Fecha de apertura</TableCell>
                  <TableCell align="center">Fecha de última actualización</TableCell>
                  <TableCell align="center">Quien respondio</TableCell>
                  <TableCell align="center">Quien cerró</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell align="center">
                      <Typography variant="body2" style={{ fontWeight: 600, color: "#3b82f6" }}>
                        #{ticket.id}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" style={{ fontWeight: 500 }}>
                        {ticket.contact.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" style={{ color: "#059669" }}>
                        {ticket.contact.number}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {formateDate(ticket.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {formateDate(ticket.updatedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="body2" 
                        style={{ 
                          color: ticket.attendant_user ? "#1e293b" : "#64748b",
                          fontStyle: ticket.attendant_user ? "normal" : "italic"
                        }}
                      >
                        {ticket.attendant_user
                          ? ticket.attendant_user.name
                          : 'Aguardando atendimento'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="body2"
                        style={{ 
                          color: ticket.closed_by_user ? "#1e293b" : "#64748b",
                          fontStyle: ticket.closed_by_user ? "normal" : "italic"
                        }}
                      >
                        {ticket.closed_by_user
                          ? ticket.closed_by_user.name
                          : 'Em atendimento'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="body2" 
                        style={{ 
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: "8px",
                          backgroundColor: "#f1f5f9",
                          color: "#475569",
                          display: "inline-block"
                        }}
                      >
                        {ticket.status.name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>

        {/* Paginação Estilizada */}
        <Box className={classes.paginationContainer}>
          <Pagination
            page={page}
            count={totalPages}
            onChange={(e) => handlePages(e.target.textContent)}
            hideNextButton={hasMore}
            hidePrevButton={page === 1}
            color="primary"
          />
          <SelectLimitDropdown
            setPage={setPage}
            setLimit={setPerPage}
            limit={perPage}
          />
        </Box>
      </MainContainer>
    </div>
  );
};

export default TicketsReports;
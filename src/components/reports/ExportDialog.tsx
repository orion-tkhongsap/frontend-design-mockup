'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Typography,
  Box,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  PictureAsPdf,
  TableChart,
  Email,
  CloudDownload,
  Schedule,
  CheckCircle,
} from '@mui/icons-material'

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv'
  includeCharts: boolean
  includeComments: boolean
  includeDetails: boolean
  emailDelivery: boolean
  scheduledExport: boolean
}

interface ExportDialogProps {
  open: boolean
  onClose: () => void
  reportName: string
  period: string
}

export function ExportDialog({ open, onClose, reportName, period }: ExportDialogProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeComments: false,
    includeDetails: true,
    emailDelivery: false,
    scheduledExport: false,
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  const handleExport = async () => {
    setIsExporting(true)
    setProgress(0)

    // Simulate export process with progress
    const steps = [
      { message: 'Preparing data...', duration: 1000 },
      { message: 'Generating report...', duration: 1500 },
      { message: 'Formatting output...', duration: 1000 },
      { message: 'Finalizing export...', duration: 800 },
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration))
      setProgress((i + 1) * 25)
    }

    // Generate mock file
    generateMockFile()
    
    setIsExporting(false)
    setExportComplete(true)
    
    // Auto-close after success
    setTimeout(() => {
      setExportComplete(false)
      setProgress(0)
      onClose()
    }, 2000)
  }

  const generateMockFile = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `${reportName.replace(/\s+/g, '_')}_${period}_${timestamp}`
    
    let content = ''
    let mimeType = ''
    let extension = ''

    switch (options.format) {
      case 'pdf':
        content = generatePDFContent()
        mimeType = 'application/pdf'
        extension = '.pdf'
        break
      case 'excel':
        content = generateExcelContent()
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        extension = '.xlsx'
        break
      case 'csv':
        content = generateCSVContent()
        mimeType = 'text/csv'
        extension = '.csv'
        break
    }

    // Create and download mock file
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName + extension
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generatePDFContent = () => {
    return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
72 720 Td
(${reportName} - ${period}) Tj
0 -20 Td
(Generated on: ${new Date().toLocaleDateString()}) Tj
0 -40 Td
(This is a mock PDF export from Orion FP&A Platform) Tj
0 -20 Td
(Enterprise Financial Reporting System) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000348 00000 n 
0000000565 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`
  }

  const generateExcelContent = () => {
    return `${reportName} - ${period}
Generated: ${new Date().toLocaleDateString()}

Account,Current Period,Prior Period,Variance,Variance %
Total Revenue,$2.45M,$2.28M,$170K,7.5%
Product Revenue,$1.85M,$1.72M,$130K,7.6%
Service Revenue,$600K,$560K,$40K,7.1%
Cost of Goods Sold,($980K),($912K),($68K),7.5%
Gross Profit,$1.47M,$1.37M,$102K,7.5%
Operating Expenses,($890K),($820K),($70K),8.5%
Operating Income,$580K,$548K,$32K,5.8%
Net Income,$435K,$411K,$24K,5.8%

This is a mock Excel export from Orion FP&A Platform
Enterprise Financial Reporting System`
  }

  const generateCSVContent = () => {
    return `Account,Current Period,Prior Period,Variance,Variance %
Total Revenue,2450000,2280000,170000,7.5
Product Revenue,1850000,1720000,130000,7.6
Service Revenue,600000,560000,40000,7.1
Cost of Goods Sold,-980000,-912000,-68000,7.5
Gross Profit,1470000,1368000,102000,7.5
Operating Expenses,-890000,-820000,-70000,8.5
Operating Income,580000,548000,32000,5.8
Net Income,435000,411000,24000,5.8`
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <PictureAsPdf sx={{ color: '#ef4444' }} />
      case 'excel': return <TableChart sx={{ color: '#22c55e' }} />
      case 'csv': return <TableChart sx={{ color: '#3b82f6' }} />
      default: return <CloudDownload />
    }
  }

  const getEstimatedSize = () => {
    switch (options.format) {
      case 'pdf': return options.includeCharts ? '2.1 MB' : '0.8 MB'
      case 'excel': return options.includeCharts ? '1.5 MB' : '0.3 MB'
      case 'csv': return '0.1 MB'
      default: return '1.0 MB'
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: '12px' },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        borderBottom: '1px solid #e0e0e0',
      }}>
        <CloudDownload sx={{ color: '#486581' }} />
        Export Report
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {isExporting ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2, color: '#486581' }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Exporting Report...
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                mb: 2, 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#486581',
                },
              }} 
            />
            <Typography variant="body2" color="text.secondary">
              {progress}% complete
            </Typography>
          </Box>
        ) : exportComplete ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 60, color: '#22c55e', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Export Complete!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your file has been downloaded successfully.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Report Info */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {reportName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Period: {period} • Estimated size: {getEstimatedSize()}
              </Typography>
            </Box>

            {/* Format Selection */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Export Format
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <RadioGroup
                value={options.format}
                onChange={(e) => handleOptionChange('format', e.target.value)}
              >
                <FormControlLabel
                  value="pdf"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PictureAsPdf sx={{ color: '#ef4444' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          PDF Report
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Professional formatted document with charts
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="excel"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TableChart sx={{ color: '#22c55e' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Excel Workbook
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Editable spreadsheet with formulas and charts
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="csv"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TableChart sx={{ color: '#3b82f6' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          CSV Data
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Raw data for analysis and integration
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            {/* Export Options */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Include Options
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.includeCharts}
                    onChange={(e) => handleOptionChange('includeCharts', e.target.checked)}
                    disabled={options.format === 'csv'}
                  />
                }
                label="Include charts and visualizations"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.includeComments}
                    onChange={(e) => handleOptionChange('includeComments', e.target.checked)}
                  />
                }
                label="Include comments and annotations"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.includeDetails}
                    onChange={(e) => handleOptionChange('includeDetails', e.target.checked)}
                  />
                }
                label="Include detailed line items"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Delivery Options */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Delivery Options
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.emailDelivery}
                    onChange={(e) => handleOptionChange('emailDelivery', e.target.checked)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ fontSize: 16 }} />
                    Email to stakeholders
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.scheduledExport}
                    onChange={(e) => handleOptionChange('scheduledExport', e.target.checked)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule sx={{ fontSize: 16 }} />
                    Schedule recurring export
                  </Box>
                }
              />
            </Box>

            {options.emailDelivery && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Report will be sent to all stakeholders with access to this report.
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      {!isExporting && !exportComplete && (
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={onClose} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleExport}
            startIcon={getFormatIcon(options.format)}
            sx={{
              textTransform: 'none',
              backgroundColor: '#486581',
              '&:hover': {
                backgroundColor: '#334e68',
              },
            }}
          >
            Export {options.format.toUpperCase()}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
import os
from datetime import datetime, timedelta
from typing import List, Optional
import io
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.lib.colors import HexColor
from .models import User, Investment, Transaction

class PDFStatementService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=HexColor('#1e3a8a'),
            alignment=1  # Center alignment
        )
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            textColor=HexColor('#1e3a8a')
        )
    
    def generate_statement(self, user: User, investments: List[Investment], transactions: List[Transaction], 
                          start_date: Optional[datetime] = None, end_date: Optional[datetime] = None,
                          statement_type: str = "full") -> bytes:
        """Generate PDF statement"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
        
        if start_date:
            transactions = [t for t in transactions if t.created_at >= start_date]
            investments = [i for i in investments if i.created_at >= start_date]
        if end_date:
            transactions = [t for t in transactions if t.created_at <= end_date]
            investments = [i for i in investments if i.created_at <= end_date]
        
        story = []
        
        story.append(Paragraph("AJMAL INVESTMENTS PLC", self.title_style))
        story.append(Paragraph("Investment Statement", self.styles['Heading2']))
        story.append(Spacer(1, 20))
        
        story.append(Paragraph("Account Information", self.heading_style))
        user_data = [
            ['Account Holder:', f"{user.first_name} {user.last_name}"],
            ['Email:', user.email],
            ['Country:', user.country],
            ['Account ID:', user.id[:8] + "..."],
            ['KYC Status:', user.kyc_status.upper()],
            ['Statement Date:', datetime.now().strftime("%B %d, %Y")],
        ]
        
        if start_date or end_date:
            period = f"{start_date.strftime('%B %d, %Y') if start_date else 'Beginning'} - {end_date.strftime('%B %d, %Y') if end_date else 'Present'}"
            user_data.append(['Statement Period:', period])
        
        user_table = Table(user_data, colWidths=[2*inch, 3*inch])
        user_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), HexColor('#f1f5f9')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(user_table)
        story.append(Spacer(1, 30))
        
        if statement_type in ["full", "investments"] and investments:
            story.append(Paragraph("Portfolio Summary", self.heading_style))
            
            total_invested = sum(inv.amount for inv in investments)
            total_current_value = sum(inv.current_value for inv in investments)
            total_profit_loss = total_current_value - total_invested
            roi_percentage = (total_profit_loss / total_invested * 100) if total_invested > 0 else 0
            
            portfolio_data = [
                ['Total Invested:', f"${total_invested:,.2f}"],
                ['Current Value:', f"${total_current_value:,.2f}"],
                ['Total Profit/Loss:', f"${total_profit_loss:,.2f}"],
                ['ROI Percentage:', f"{roi_percentage:.2f}%"],
                ['Active Investments:', str(len([i for i in investments if i.status == 'active']))],
            ]
            
            portfolio_table = Table(portfolio_data, colWidths=[2*inch, 2*inch])
            portfolio_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), HexColor('#f1f5f9')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ]))
            story.append(portfolio_table)
            story.append(Spacer(1, 30))
            
            story.append(Paragraph("Investment Details", self.heading_style))
            
            investment_data = [['Category', 'Amount', 'Current Value', 'Profit/Loss', 'ROI %', 'Date']]
            for inv in investments:
                profit_loss = inv.current_value - inv.amount
                roi = (profit_loss / inv.amount * 100) if inv.amount > 0 else 0
                investment_data.append([
                    inv.category.replace('_', ' ').title(),
                    f"${inv.amount:,.2f}",
                    f"${inv.current_value:,.2f}",
                    f"${profit_loss:,.2f}",
                    f"{roi:.2f}%",
                    inv.created_at.strftime("%m/%d/%Y")
                ])
            
            investment_table = Table(investment_data, colWidths=[1.5*inch, 1*inch, 1*inch, 1*inch, 0.8*inch, 1*inch])
            investment_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1e3a8a')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, HexColor('#f8fafc')]),
            ]))
            story.append(investment_table)
            story.append(Spacer(1, 30))
        
        if statement_type in ["full", "transactions"] and transactions:
            story.append(Paragraph("Transaction History", self.heading_style))
            
            transaction_data = [['Date', 'Type', 'Amount', 'Description', 'Status']]
            for txn in sorted(transactions, key=lambda x: x.created_at, reverse=True):
                transaction_data.append([
                    txn.created_at.strftime("%m/%d/%Y"),
                    txn.type.replace('_', ' ').title(),
                    f"${txn.amount:,.2f}",
                    txn.description[:30] + "..." if len(txn.description) > 30 else txn.description,
                    txn.status.title()
                ])
            
            transaction_table = Table(transaction_data, colWidths=[1*inch, 1.2*inch, 1*inch, 2*inch, 1*inch])
            transaction_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1e3a8a')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, HexColor('#f8fafc')]),
            ]))
            story.append(transaction_table)
            story.append(Spacer(1, 30))
        
        story.append(Spacer(1, 50))
        footer_text = """
        <para align="center">
        <b>AJMAL INVESTMENTS PLC</b><br/>
        71-75 Shelton St, London WC2H 9JQ, UK<br/>
        Email: info@ajmalinvestment.com | Phone: +447882415437<br/>
        <br/>
        <i>This statement is generated electronically and is valid without signature.</i><br/>
        <i>For questions about this statement, please contact our support team.</i>
        </para>
        """
        story.append(Paragraph(footer_text, self.styles['Normal']))
        
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()

pdf_service = PDFStatementService()

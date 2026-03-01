
export const generateReceiptHtml = (data: {
    poleId: string;
    techName: string;
    faultCategory: string;
    timestamp: string;
    beforePhoto: string;
    afterPhoto: string;
    workNotes?: string;
    ugLogo: string;
}) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Maintenance Receipt - ${data.poleId}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { 
                background: #f8fafc; 
                color: #1e293b; 
                margin: 0; 
                padding: 40px; 
                font-family: 'Inter', sans-serif;
                line-height: 1.5;
            }
            .certificate {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 60px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                position: relative;
            }
            .header {
                display: flex;
                align-items: center;
                gap: 20px;
                border-bottom: 3px solid #1A365D;
                padding-bottom: 30px;
                margin-bottom: 40px;
            }
            .logo { width: 80px; height: auto; }
            .header-text h1 { 
                margin: 0; 
                color: #1A365D; 
                text-transform: uppercase; 
                letter-spacing: -0.02em;
                font-size: 24px;
                font-weight: 900;
            }
            .header-text p { margin: 5px 0 0; color: #64748b; font-size: 14px; font-weight: 600; }
            
            .meta {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 30px;
                margin-bottom: 40px;
            }
            .meta-item label {
                display: block;
                text-transform: uppercase;
                font-size: 10px;
                font-weight: 900;
                color: #94a3b8;
                letter-spacing: 0.1em;
                margin-bottom: 5px;
            }
            .meta-item p {
                margin: 0;
                font-size: 16px;
                font-weight: 700;
                color: #1A365D;
            }

            .photos {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin-bottom: 40px;
            }
            .photo-box {
                background: #f1f5f9;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid #e2e8f0;
            }
            .photo-box img {
                width: 100%;
                height: 300px;
                object-cover: cover;
                display: block;
            }
            .photo-label {
                padding: 12px;
                background: #1A365D;
                color: white;
                text-align: center;
                font-size: 11px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }

            .notes {
                padding: 24px;
                background: #f8fafc;
                border-left: 4px solid #1A365D;
                border-radius: 0 8px 8px 0;
                margin-bottom: 40px;
            }
            .notes h3 {
                margin: 0 0 10px;
                font-size: 12px;
                text-transform: uppercase;
                color: #1A365D;
                letter-spacing: 0.05em;
            }
            .notes p {
                margin: 0;
                font-size: 14px;
                color: #475569;
                font-style: italic;
            }

            .footer {
                text-align: center;
                border-top: 1px solid #e2e8f0;
                padding-top: 30px;
                font-size: 12px;
                color: #94a3b8;
            }

            @media print {
                body { padding: 0; background: white; }
                .certificate { border: none; box-shadow: none; }
            }
        </style>
    </head>
    <body onload="window.print()">
        <div class="certificate">
            <div class="header">
                <img src="${data.ugLogo}" class="logo" alt="UG Logo" />
                <div class="header-text">
                    <h1>Maintenance Completion Record</h1>
                    <p>University of Ghana Physical Development & Municipal Services Directorate</p>
                </div>
            </div>

            <div class="meta">
                <div class="meta-item">
                    <label>Asset ID</label>
                    <p>${data.poleId}</p>
                </div>
                <div class="meta-item">
                    <label>Assigned Technician</label>
                    <p>${data.techName}</p>
                </div>
                <div class="meta-item">
                    <label>Fault Category</label>
                    <p>${data.faultCategory}</p>
                </div>
                <div class="meta-item">
                    <label>Completion Date</label>
                    <p>${data.timestamp}</p>
                </div>
            </div>

            <div class="photos">
                <div class="photo-box">
                    <img src="${data.beforePhoto}" alt="Before Repair" />
                    <div class="photo-label">Initial Assessment (Before)</div>
                </div>
                <div class="photo-box">
                    <img src="${data.afterPhoto}" alt="After Repair" />
                    <div class="photo-label">Completion Status (After)</div>
                </div>
            </div>

            ${data.workNotes ? `
            <div class="notes">
                <h3>Technician Remarks</h3>
                <p>${data.workNotes}</p>
            </div>
            ` : ''}

            <div class="footer">
                <p>This document serves as digital evidence of maintenance completion.</p>
                <p>Campus Glow Network Security - Generated: ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

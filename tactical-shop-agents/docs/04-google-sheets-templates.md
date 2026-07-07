# Google Sheets Templates

Create two spreadsheets. Row 1 = headers exactly as below (Make maps by column
position; the imported blueprints assume this order).

---

## Spreadsheet 1: `Company Brain` (long-term memory)

### Sheet `Decisions`
| A | B | C | D | E |
|---|---|---|---|---|
| timestamp | agent | action | log_message | context (escalate_to / thread / task id) |

Every agent decision is appended here — the audit trail for the whole company.

### Sheet `Policies`
| A | B | C | D |
|---|---|---|---|
| policy_name | value | updated_at | changed_by |

Seed rows: `margin_floor_pct = 25`, `clearance_floor_pct = 10`,
`approval_threshold_gel = 500`, `ad_daily_human_cap_gel = 200`,
`refund_human_cap_gel = 200`, `free_shipping_over_gel = 200`,
`return_window_days = 14`, `sla_first_response_hours = 2`.

### Sheet `Suppliers`
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| supplier_name | alibaba_url | contact | lead_time_days | moq | payment_terms | notes |

### Sheet `Prices` (history)
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| date | sku | old_price_gel | new_price_gel | margin_pct_after | approved_by |

### Sheet `Incidents`
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| timestamp | scenario | module | error_message | status (open/triaged/fixed) | retry_count |

### Sheet `Content Calendar`
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| date | slot (am/pm) | theme | channel | status (planned/posted/skipped) | post_ref |

### Sheet `Marketing KPIs`
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| week | spend_gel | impressions | clicks | ctr_pct | purchases | roas |

---

## Spreadsheet 2: `Finance` 

### Sheet `Ledger`
| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| date | order_id | type (sale/refund/fee/expense) | net_gel | vat_gel | gross_gel | currency_orig | amount_orig | payment_method | matched_ref | status |

VAT convention: domestic sale `vat_gel = gross × 18/118`; export rows
`vat_gel = 0`, status `export`.

### Sheet `Unmatched`
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| date | reference | amount | currency | best_guess_order | age_days |

### Sheet `P&L Snapshot` (CFO weekly)
| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| period (ISO week) | revenue_gel | cogs_gel | gross_margin_pct | ad_spend_gel | opex_gel | net_gel | top_skus | notes |

### Sheet `Cash Forecast`
| A | B | C | D | E |
|---|---|---|---|---|
| week_start | inflow_gel | outflow_gel | closing_gel | alert |

### Sheet `VAT Export` (monthly, rs.ge-ready)
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| month | total_net_gel | total_vat_gel | export_sales_gel (zero-rated) | rows_count | anomalies |

Hand this sheet (plus the Ledger filter for the month) to your accountant for
the rs.ge declaration — it is a preparation aid, not a filing.

### Sheet `Invoice Counter`
| A | B |
|---|---|
| year | next_invoice_number |

(Or keep the counter in a 1-record Data Store as noted in build instructions.)

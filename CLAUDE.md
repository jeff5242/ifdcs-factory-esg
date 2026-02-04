# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IFDCS (Invasion Free Data Capture System) is a smart factory non-invasive data collection system for manufacturing facilities. It monitors equipment performance, energy consumption, and production metrics without requiring modifications to existing machinery.

**Current Status**: Design/specification phase. The `frontend/` directory is empty and awaiting implementation. The `ifdcs.pen` file contains UI/UX designs.

## Architecture

### Planned Technology Stack

**Backend**:
- Time Series Database: InfluxDB or TimescaleDB
- Data Collection: Modbus TCP/RTU, MQTT protocols
- API: RESTful interface
- Notifications: Email and Line messaging
- OS: Ubuntu Server 22.04 LTS (recommended)

**Frontend**:
- Responsive Web Design (RWD) for desktop/tablet/mobile
- Browser support: Chrome 90+, Firefox 88+, Edge 90+

### Core Modules

**Backend Services**:
- Time series database for sensor data storage
- Data collection engine (Modbus TCP/RTU, MQTT)
- Data analysis engine (power consumption, carbon emissions, utilization rates, yield, FPY, UPH)
- RESTful API
- Alert/notification system
- MAC address and sensor configuration management

**Frontend Modules**:
- Login and role-based permission management
- Dashboard with KPI cards and navigation
- Power consumption monitoring (real-time current, accumulated usage, carbon emissions, hourly charts)
- Equipment utilization rate monitoring
- Yield rate statistics (good/defective counts, first-pass yield)
- UPH (Units Per Hour) production statistics
- Historical data queries with Excel/CSV export
- War Room display (large screen dashboard)

### Data Flow
```
Sensors (CT/Distance/Counter) → Industrial Gateway → Data Collection Engine → Time Series DB → Analysis Engine → REST API → Frontend
```

## Key Design Files

- `ifdcs.pen` - UI/UX mockups (Pencil design format, 10K+ lines)
- `報價資料/` - Specifications and architecture documentation in Traditional Chinese

## Hardware Integration

**Supported Sensors**:
- CT current sensors (3-phase, clip-on, Hall effect)
- Distance sensors (laser, ultrasonic)
- Counter sensors (photoelectric, proximity switch)

**Communication Protocols**:
- Modbus TCP/RTU
- MQTT

## Data Retention Policy

- Real-time data: 7 days at full precision
- Historical data: 1 year (configurable)
- Statistical reports: permanent

## Language Notes

Documentation is in Traditional Chinese (Taiwan). The system should support internationalization for multi-language deployment.

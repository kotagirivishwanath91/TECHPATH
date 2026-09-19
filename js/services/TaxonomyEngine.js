/**
 * TECHPATH — COMPLETE ACADEMIC TAXONOMY ENGINE
 * 33 Canonical Engineering Departments, Complete Branch/Specialization Hierarchy,
 * and Dynamic Role Mapping Engine.
 */

export const DEPARTMENTS = [
  {
    id: 'dept_cs',
    name: 'Computer & Computing',
    code: 'CS',
    description: 'Computer science, software engineering, systems architecture, distributed networks, and cloud computation.',
    branches: [
      {
        id: 'cse',
        code: 'CSE',
        name: 'Computer Science & Engineering',
        specializations: [
          { id: 'spec_cse_core', name: 'Core Systems & Distributed Computing' },
          { id: 'spec_cse_swe', name: 'Software Engineering & Cloud Architecture' },
          { id: 'spec_cse_cyber', name: 'Cybersecurity & Network Defense' },
          { id: 'spec_cse_devops', name: 'DevOps & Site Reliability' }
        ],
        roles: [
          'Software Engineer', 'Full Stack Developer', 'Backend Developer',
          'Frontend Developer', 'Mobile Developer', 'DevOps Engineer',
          'Cloud Engineer', 'Systems Engineer', 'QA Engineer'
        ]
      },
      {
        id: 'it',
        code: 'IT',
        name: 'Information Technology',
        specializations: [
          { id: 'spec_it_enterprise', name: 'Enterprise Systems & Infrastructure' },
          { id: 'spec_it_security', name: 'Network Security & IT Operations' },
          { id: 'spec_it_cloud', name: 'Cloud Infrastructure & Virtualization' }
        ],
        roles: [
          'IT Systems Architect', 'Cloud Solutions Engineer', 'Enterprise Systems Engineer',
          'DevOps Engineer', 'Network Administrator', 'Cybersecurity Analyst'
        ]
      },
      {
        id: 'cybersecurity',
        code: 'CYBER',
        name: 'Information Security & Cybersecurity',
        specializations: [
          { id: 'spec_sec_soc', name: 'SOC Operations & Threat Intelligence' },
          { id: 'spec_sec_app', name: 'Application Security & Penetration Testing' },
          { id: 'spec_sec_crypto', name: 'Cryptography & Protocol Security' }
        ],
        roles: [
          'Security Operations Engineer', 'Penetration Tester', 'Application Security Engineer',
          'Cyber Threat Intelligence Specialist', 'Information Security Officer'
        ]
      }
    ]
  },
  {
    id: 'dept_ai_data',
    name: 'AI & Data',
    code: 'AI_DATA',
    description: 'Artificial intelligence, machine learning, deep learning, data science, and data engineering.',
    branches: [
      {
        id: 'aiml',
        code: 'AI/ML',
        name: 'Artificial Intelligence & Machine Learning',
        specializations: [
          { id: 'spec_ai_deep', name: 'Deep Learning & Neural Architectures' },
          { id: 'spec_ai_nlp', name: 'Natural Language Processing & LLMs' },
          { id: 'spec_ai_cv', name: 'Computer Vision & Multimodal Perception' },
          { id: 'spec_ai_gen', name: 'Generative AI & Agentic Systems' }
        ],
        roles: [
          'AI Engineer', 'Machine Learning Engineer', 'Data Scientist',
          'NLP Engineer', 'Computer Vision Engineer', 'Generative AI Engineer',
          'AI Research Engineer', 'Data Engineer'
        ]
      },
      {
        id: 'ds',
        code: 'DATA_SCI',
        name: 'Data Science & Big Data Analytics',
        specializations: [
          { id: 'spec_ds_analytics', name: 'Predictive Modeling & Statistical Computing' },
          { id: 'spec_ds_engineering', name: 'High-Throughput Data Pipelines & ETL' },
          { id: 'spec_ds_business', name: 'Decision Science & Business Analytics' }
        ],
        roles: [
          'Data Scientist', 'Data Engineer', 'Big Data Architect',
          'Analytics Consultant', 'Business Intelligence Engineer', 'ML Platform Engineer'
        ]
      }
    ]
  },
  {
    id: 'dept_ece',
    name: 'Electronics & Communication',
    code: 'ECE',
    description: 'Semiconductors, VLSI design, embedded microcontrollers, wireless communications, and signal processing.',
    branches: [
      {
        id: 'ece',
        code: 'ECE',
        name: 'Electronics & Communication Engineering',
        specializations: [
          { id: 'spec_ece_vlsi', name: 'VLSI Design & Semiconductor Fabrication' },
          { id: 'spec_ece_embedded', name: 'Embedded Systems & Real-Time Firmware' },
          { id: 'spec_ece_rf', name: 'RF Engineering & 5G/6G Wireless Networks' },
          { id: 'spec_ece_iot', name: 'Internet of Things (IoT) & Edge Computing' }
        ],
        roles: [
          'Embedded Systems Engineer', 'VLSI Engineer', 'Semiconductor Engineer',
          'FPGA Engineer', 'ASIC Engineer', 'RF Engineer',
          'Communication Engineer', 'Electronics Design Engineer', 'IoT Engineer'
        ]
      },
      {
        id: 'microelectronics',
        code: 'MICRO',
        name: 'Microelectronics & Nanotechnology',
        specializations: [
          { id: 'spec_micro_chip', name: 'Chip Design & Physical Verification' },
          { id: 'spec_micro_nano', name: 'Nanomaterials & Semiconductor Physics' }
        ],
        roles: [
          'Semiconductor Device Engineer', 'Physical Design Engineer',
          'Foundry Process Engineer', 'Nanotechnology Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_eee',
    name: 'Electrical & Power',
    code: 'EEE',
    description: 'Electric power generation, transmission, smart grids, renewable energy, and power electronics.',
    branches: [
      {
        id: 'eee',
        code: 'EEE',
        name: 'Electrical & Electronics Engineering',
        specializations: [
          { id: 'spec_eee_power', name: 'Power Systems & High-Voltage Transmission' },
          { id: 'spec_eee_renew', name: 'Renewable Energy & Photovoltaic Integration' },
          { id: 'spec_eee_ev', name: 'Electric Vehicle Powertrains & Battery Systems' },
          { id: 'spec_eee_pe', name: 'Power Electronics & Drives' }
        ],
        roles: [
          'Electrical Engineer', 'Power Systems Engineer', 'Power Electronics Engineer',
          'Control Engineer', 'Renewable Energy Engineer', 'Smart Grid Engineer',
          'EV Engineer', 'Battery Engineer', 'Electrical Design Engineer'
        ]
      },
      {
        id: 'smartgrid',
        code: 'SMART_GRID',
        name: 'Smart Grid & Renewable Energy Technology',
        specializations: [
          { id: 'spec_sg_grid', name: 'Microgrids & Distributed Generation' },
          { id: 'spec_sg_storage', name: 'Grid-Scale Energy Storage Systems' }
        ],
        roles: [
          'Smart Grid Architect', 'Renewable Energy Project Engineer',
          'Energy Storage Systems Engineer', 'Grid Integration Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_mech',
    name: 'Mechanical & Manufacturing',
    code: 'MECH',
    description: 'Thermal systems, mechanical design, machine dynamics, fluid mechanics, and additive manufacturing.',
    branches: [
      {
        id: 'mech',
        code: 'MECH',
        name: 'Mechanical Engineering',
        specializations: [
          { id: 'spec_mech_cad', name: 'Computer-Aided Design (CAD) & Finite Element Analysis' },
          { id: 'spec_mech_thermal', name: 'Thermal Systems & Computational Fluid Dynamics (CFD)' },
          { id: 'spec_mech_mfg', name: 'Advanced Manufacturing & CNC Precision' },
          { id: 'spec_mech_mecha', name: 'Mechatronics & Electro-Mechanical Systems' }
        ],
        roles: [
          'Mechanical Design Engineer', 'Manufacturing Engineer', 'Production Engineer',
          'CAD Engineer', 'Thermal Engineer', 'Automotive Engineer',
          'Robotics Engineer', 'Mechatronics Engineer', 'Quality Engineer'
        ]
      },
      {
        id: 'mfg_eng',
        code: 'MFG',
        name: 'Manufacturing & Precision Engineering',
        specializations: [
          { id: 'spec_mfg_additive', name: 'Additive Manufacturing & 3D Printing' },
          { id: 'spec_mfg_lean', name: 'Lean Production & Six Sigma Quality' }
        ],
        roles: [
          'Manufacturing Process Engineer', 'Tooling & Die Design Specialist',
          'Production Operations Manager', 'Quality Control Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_auto',
    name: 'Automobile & Automotive',
    code: 'AUTO',
    description: 'Vehicle dynamics, powertrain engineering, connected vehicles, and autonomous driving architectures.',
    branches: [
      {
        id: 'automobile',
        code: 'AUTO',
        name: 'Automobile Engineering',
        specializations: [
          { id: 'spec_auto_ev', name: 'Electric Vehicles & Battery Management' },
          { id: 'spec_auto_dyn', name: 'Vehicle Dynamics & Chassis Design' },
          { id: 'spec_auto_ad', name: 'Autonomous Driving & ADAS Sensors' }
        ],
        roles: [
          'Automotive Design Engineer', 'EV Powertrain Engineer', 'Vehicle Dynamics Engineer',
          'Crash Safety & NVH Engineer', 'ADAS Systems Engineer', 'Homologation Specialist'
        ]
      },
      {
        id: 'ev_eng',
        code: 'EV',
        name: 'Electric Vehicle & Mobility Engineering',
        specializations: [
          { id: 'spec_ev_bms', name: 'Battery Management Systems & Thermal Cooling' },
          { id: 'spec_ev_charging', name: 'High-Power Fast Charging Infrastructure' }
        ],
        roles: [
          'Battery Pack Design Engineer', 'BMS Firmware Engineer',
          'EV Calibration Engineer', 'Motor Control Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_civil',
    name: 'Civil & Infrastructure',
    code: 'CIVIL',
    description: 'Structural mechanics, geotechnical foundation, smart transportation, and large-scale infrastructure.',
    branches: [
      {
        id: 'civil',
        code: 'CIVIL',
        name: 'Civil Engineering',
        specializations: [
          { id: 'spec_civil_struct', name: 'Structural Engineering & Seismic Design' },
          { id: 'spec_civil_geotech', name: 'Geotechnical Engineering & Deep Foundations' },
          { id: 'spec_civil_trans', name: 'Transportation & Highway Systems' },
          { id: 'spec_civil_bim', name: 'Building Information Modeling (BIM) & Digital Twin' }
        ],
        roles: [
          'Structural Engineer', 'Site Engineer', 'Construction Engineer',
          'Geotechnical Engineer', 'Transportation Engineer', 'Water Resources Engineer',
          'Environmental Engineer', 'Planning Engineer', 'Infrastructure Engineer'
        ]
      },
      {
        id: 'construction_eng',
        code: 'CONSTR',
        name: 'Construction Technology & Management',
        specializations: [
          { id: 'spec_constr_project', name: 'Mega-Project Scheduling & Cost Control' },
          { id: 'spec_constr_materials', name: 'Advanced Concrete & Green Building Materials' }
        ],
        roles: [
          'Construction Project Manager', 'Quantity Surveyor', 'BIM Coordinator',
          'Site Safety Superintendent', 'Structural Inspector'
        ]
      }
    ]
  },
  {
    id: 'dept_env',
    name: 'Environmental & Sustainability',
    code: 'ENV',
    description: 'Ecological balance, pollution mitigation, waste remediation, circular economy, and ESG engineering.',
    branches: [
      {
        id: 'env',
        code: 'ENV',
        name: 'Environmental Engineering',
        specializations: [
          { id: 'spec_env_waste', name: 'Water & Wastewater Treatment Design' },
          { id: 'spec_env_air', name: 'Air Pollution Modeling & Industrial Scrubbers' },
          { id: 'spec_env_circular', name: 'Solid Waste Remediation & Circular Economics' }
        ],
        roles: [
          'Environmental Engineer', 'Sustainability Specialist', 'Wastewater Process Engineer',
          'Air Quality Consultant', 'ESG Reporting Analyst', 'Remediation Project Manager'
        ]
      }
    ]
  },
  {
    id: 'dept_chem',
    name: 'Chemical & Process',
    code: 'CHEM',
    description: 'Thermodynamics, reaction kinetics, mass/heat transfer, separation operations, and industrial scaling.',
    branches: [
      {
        id: 'chemical',
        code: 'CHEM',
        name: 'Chemical Engineering',
        specializations: [
          { id: 'spec_chem_process', name: 'Chemical Process Modeling & Aspen Simulation' },
          { id: 'spec_chem_catalysis', name: 'Catalysis & Industrial Reaction Kinetics' },
          { id: 'spec_chem_petro', name: 'Petrochemical Distillation & Refinery Operations' }
        ],
        roles: [
          'Process Engineer', 'Chemical Engineer', 'Process Control Engineer',
          'Plant Engineer', 'Safety Engineer', 'Quality Engineer',
          'Petrochemical Engineer', 'Refinery Engineer', 'Process Automation Engineer'
        ]
      }
    ]
  },
  {
    id: 'dept_pharma',
    name: 'Pharmaceutical Engineering',
    code: 'PHARMA',
    description: 'Drug delivery systems, bioprocess formulation, sterile manufacturing, and FDA regulatory compliance.',
    branches: [
      {
        id: 'pharma_eng',
        code: 'PHARMA_ENG',
        name: 'Pharmaceutical Technology & Engineering',
        specializations: [
          { id: 'spec_pharma_form', name: 'Formulation Design & Controlled Drug Release' },
          { id: 'spec_pharma_cgmp', name: 'Sterile Manufacturing & cGMP Validation' }
        ],
        roles: [
          'Pharmaceutical Process Engineer', 'Formulation Scientist', 'Validation Engineer',
          'Quality Assurance Lead', 'Regulatory Affairs Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_biotech',
    name: 'Biotechnology & Bioengineering',
    code: 'BIOTECH',
    description: 'Recombinant DNA, microbial fermentation, genetic manipulation, and bio-industrial manufacturing.',
    branches: [
      {
        id: 'biotech',
        code: 'BIOTECH',
        name: 'Biotechnology Engineering',
        specializations: [
          { id: 'spec_bt_ferm', name: 'Bioreactor Design & Upstream Fermentation' },
          { id: 'spec_bt_down', name: 'Downstream Purification & Chromatography' },
          { id: 'spec_bt_gene', name: 'Genetic Engineering & CRISPR Gene Editing' }
        ],
        roles: [
          'Bioprocess Engineer', 'Fermentation Scientist', 'Purification Specialist',
          'Genetic Engineer', 'Biotech Quality Analyst'
        ]
      }
    ]
  },
  {
    id: 'dept_biomed',
    name: 'Biomedical & Medical Engineering',
    code: 'BIOMED',
    description: 'Medical diagnostics, physiological sensors, implantable biomaterials, and clinical telemetry.',
    branches: [
      {
        id: 'biomed',
        code: 'BIOMED',
        name: 'Biomedical Engineering',
        specializations: [
          { id: 'spec_bm_imaging', name: 'Medical Imaging & Radiology Instrumentation' },
          { id: 'spec_bm_implants', name: 'Biomechanics, Prosthetics & Biomaterials' },
          { id: 'spec_bm_sensors', name: 'Wearable Biosensors & Clinical Telemetry' }
        ],
        roles: [
          'Biomedical Engineer', 'Medical Device Engineer', 'Clinical Engineer',
          'Medical Electronics Engineer', 'Medical Imaging Engineer', 'Rehabilitation Engineer',
          'Healthcare Technology Engineer'
        ]
      }
    ]
  },
  {
    id: 'dept_bioinfo',
    name: 'Bioinformatics & Computational Biology',
    code: 'BIOINFO',
    description: 'Genomic sequence alignment, protein folding simulations, molecular docking, and biomedical big data.',
    branches: [
      {
        id: 'bioinfo',
        code: 'BIOINFO',
        name: 'Bioinformatics & Computational Biology',
        specializations: [
          { id: 'spec_bi_genomics', name: 'Next-Generation Sequencing & Genomics' },
          { id: 'spec_bi_docking', name: 'Structural Biology & In-Silico Drug Discovery' }
        ],
        roles: [
          'Bioinformatics Scientist', 'Computational Biologist', 'Genomics Data Analyst',
          'Structural Bioinformatician', 'In-Silico Screening Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_aero',
    name: 'Aerospace & Aviation',
    code: 'AERO',
    description: 'Aerodynamics, orbital mechanics, gas turbine propulsion, satellite avionics, and space exploration.',
    branches: [
      {
        id: 'aero',
        code: 'AERO',
        name: 'Aerospace & Aeronautical Engineering',
        specializations: [
          { id: 'spec_aero_prop', name: 'Rocket & Air-Breathing Propulsion Systems' },
          { id: 'spec_aero_avionics', name: 'Guidance, Navigation, and Control (GNC)' },
          { id: 'spec_aero_space', name: 'Orbital Mechanics & Satellite Constellations' },
          { id: 'spec_aero_uav', name: 'Unmanned Aerial Systems (UAS) & Drone Autonomy' }
        ],
        roles: [
          'Aerospace Engineer', 'Aeronautical Engineer', 'Avionics Engineer',
          'Propulsion Engineer', 'Flight Systems Engineer', 'Aircraft Design Engineer',
          'Drone/UAS Engineer', 'Space Systems Engineer'
        ]
      }
    ]
  },
  {
    id: 'dept_marine',
    name: 'Marine & Ocean',
    code: 'MARINE',
    description: 'Naval architecture, offshore energy platforms, marine hydrodynamics, and subsea engineering.',
    branches: [
      {
        id: 'marine_eng',
        code: 'MARINE',
        name: 'Marine Engineering & Naval Architecture',
        specializations: [
          { id: 'spec_marine_hull', name: 'Ship Hull Hydrodynamics & Stability' },
          { id: 'spec_marine_subsea', name: 'Subsea Robotics & Deep Offshore Rigs' }
        ],
        roles: [
          'Naval Architect', 'Marine Systems Engineer', 'Offshore Structural Engineer',
          'Subsea Robotics Specialist', 'Shipyard Operations Manager'
        ]
      }
    ]
  },
  {
    id: 'dept_mining',
    name: 'Mining & Earth',
    code: 'MINING',
    description: 'Subsurface resource extraction, rock geomechanics, mineral beneficiation, and mine safety.',
    branches: [
      {
        id: 'mining_eng',
        code: 'MINING',
        name: 'Mining & Earth Sciences Engineering',
        specializations: [
          { id: 'spec_mining_geo', name: 'Rock Geomechanics & Tunnel Support' },
          { id: 'spec_mining_surface', name: 'Open-Cast Extraction & Blast Optimization' }
        ],
        roles: [
          'Mining Operations Engineer', 'Rock Mechanics Specialist', 'Mine Planning Engineer',
          'Geotechnical Exploration Engineer', 'Mineral Processing Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_metallurgy',
    name: 'Metallurgy & Materials',
    code: 'METALLURGY',
    description: 'Physical metallurgy, phase transformations, corrosion engineering, ceramics, and superalloys.',
    branches: [
      {
        id: 'metallurgy',
        code: 'MET',
        name: 'Metallurgical & Materials Engineering',
        specializations: [
          { id: 'spec_met_alloys', name: 'High-Temperature Superalloys & Titanium' },
          { id: 'spec_met_corrosion', name: 'Corrosion Prevention & Surface Coating' }
        ],
        roles: [
          'Materials Scientist', 'Metallurgical Engineer', 'Failure Analysis Specialist',
          'Corrosion Prevention Consultant', 'Welding & NDT Inspection Engineer'
        ]
      }
    ]
  },
  {
    id: 'dept_agri',
    name: 'Agricultural Engineering',
    code: 'AGRI',
    description: 'Precision farming, smart irrigation hydraulics, automated harvesting, and post-harvest technology.',
    branches: [
      {
        id: 'agri_eng',
        code: 'AGRI',
        name: 'Agricultural Engineering & Smart Farming',
        specializations: [
          { id: 'spec_agri_irrig', name: 'Micro-Irrigation & Water Table Preservation' },
          { id: 'spec_agri_machinery', name: 'Autonomous Tractors & Robotic Harvesters' }
        ],
        roles: [
          'Agricultural Automation Engineer', 'Precision Agriculture Specialist',
          'Irrigation Infrastructure Engineer', 'Farm Machinery Design Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_food',
    name: 'Food Technology',
    code: 'FOOD',
    description: 'Food preservation, thermal sterilization, extrusion engineering, and nutrition microbiology.',
    branches: [
      {
        id: 'food_tech',
        code: 'FOOD_TECH',
        name: 'Food Process Engineering & Technology',
        specializations: [
          { id: 'spec_food_preserv', name: 'Aseptic Processing & Cold Chain Logistics' },
          { id: 'spec_food_safety', name: 'HACCP Standards & Microbial Quality' }
        ],
        roles: [
          'Food Process Engineer', 'Food Safety Auditor', 'Product Development Scientist',
          'Packaging Quality Engineer', 'Cold-Chain Logistics Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_textile',
    name: 'Textile & Fashion Technology',
    code: 'TEXTILE',
    description: 'Fiber polymer chemistry, weaving ergonomics, functional smart textiles, and dyeing kinetics.',
    branches: [
      {
        id: 'textile_eng',
        code: 'TEXTILE',
        name: 'Textile Engineering & Smart Fabrics',
        specializations: [
          { id: 'spec_textile_smart', name: 'E-Textiles, Biosensing Fibers & Smart Wearables' },
          { id: 'spec_textile_finishing', name: 'Eco-Friendly Dyeing & Polymer Chemistry' }
        ],
        roles: [
          'Textile Process Engineer', 'Smart Fabric Developer', 'Quality Assurance Specialist',
          'Dyeing and Finishing Technologist', 'Technical Textile Consultant'
        ]
      }
    ]
  },
  {
    id: 'dept_polymer',
    name: 'Polymer / Plastic / Rubber',
    code: 'POLYMER',
    description: 'Polymerization reactors, elastomer rheology, injection molding, and biodegradable bioplastics.',
    branches: [
      {
        id: 'polymer_eng',
        code: 'POLYMER',
        name: 'Polymer & Rubber Technology',
        specializations: [
          { id: 'spec_poly_molding', name: 'Precision Injection Molding & Extrusion Dies' },
          { id: 'spec_poly_biodegradable', name: 'Biopolymers & Recycling Synthetics' }
        ],
        roles: [
          'Polymer Chemist', 'Plastic Molding Process Engineer', 'Elastomer Compounder',
          'Materials Formulation Scientist', 'Packaging Materials Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_energy',
    name: 'Oil / Gas / Energy',
    code: 'ENERGY',
    description: 'Upstream reservoir engineering, well logging, LNG processing, and sustainable energy transitions.',
    branches: [
      {
        id: 'petroleum_eng',
        code: 'PETRO',
        name: 'Petroleum & Energy Resources Engineering',
        specializations: [
          { id: 'spec_petro_reservoir', name: 'Reservoir Simulation & Enhanced Recovery' },
          { id: 'spec_petro_drilling', name: 'Directional Drilling & Subsurface Hydraulics' }
        ],
        roles: [
          'Petroleum Reservoir Engineer', 'Drilling Operations Engineer', 'Production Technologist',
          'Energy Transition Analyst', 'Pipeline Integrity Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_nuclear',
    name: 'Nuclear Engineering',
    code: 'NUCLEAR',
    description: 'Fission reactor physics, radiation shielding, thermal hydraulics, and radioactive isotope safety.',
    branches: [
      {
        id: 'nuclear_eng',
        code: 'NUCLEAR',
        name: 'Nuclear Science & Engineering',
        specializations: [
          { id: 'spec_nuc_thermal', name: 'Reactor Core Thermal Hydraulics & Safety Cooling' },
          { id: 'spec_nuc_waste', name: 'Radionuclide Containment & Shielding Physics' }
        ],
        roles: [
          'Nuclear Reactor Engineer', 'Radiation Protection Specialist', 'Safety Analysis Engineer',
          'Fuel Cycle Specialist', 'Decommissioning Engineer'
        ]
      }
    ]
  },
  {
    id: 'dept_inst',
    name: 'Instrumentation & Control',
    code: 'INST',
    description: 'Industrial sensors, PLC/SCADA control loops, distributed telemetry, and signal conditioning.',
    branches: [
      {
        id: 'inst_control',
        code: 'ICE',
        name: 'Instrumentation & Control Engineering',
        specializations: [
          { id: 'spec_ice_scada', name: 'Industrial SCADA, DCS & PLC Automation' },
          { id: 'spec_ice_sensors', name: 'Precision Metrology & Smart Transducers' }
        ],
        roles: [
          'Instrumentation Engineer', 'Controls Automation Specialist', 'SCADA Architect',
          'Metrology Calibration Engineer', 'Process Instrumentation Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_robotics',
    name: 'Robotics & Automation',
    code: 'ROBOTICS',
    description: 'Kinematics, inverse dynamics, robotic perception, path planning, and industrial automation arms.',
    branches: [
      {
        id: 'robotics',
        code: 'ROBOTICS',
        name: 'Robotics & Automation Engineering',
        specializations: [
          { id: 'spec_rob_motion', name: 'Motion Planning, Kinematics & SLAM' },
          { id: 'spec_rob_vision', name: 'Robotic Perception & Autonomous Mobile Robots' },
          { id: 'spec_rob_industrial', name: 'Industrial Cobots & Factory Cell Automation' }
        ],
        roles: [
          'Robotics Engineer', 'Automation Engineer', 'Robot Controls Engineer',
          'Autonomous Systems Engineer', 'Computer Vision Engineer', 'Mechatronics Engineer',
          'Industrial Robotics Engineer'
        ]
      }
    ]
  },
  {
    id: 'dept_industrial',
    name: 'Industrial & Systems',
    code: 'INDUSTRIAL',
    description: 'Operations research, supply chain simulation, ergonomics, queueing theory, and logistics optimization.',
    branches: [
      {
        id: 'industrial_eng',
        code: 'IE',
        name: 'Industrial & Systems Engineering',
        specializations: [
          { id: 'spec_ie_or', name: 'Operations Research & Mathematical Modeling' },
          { id: 'spec_ie_supply', name: 'Global Supply Chain Architecture & Simulation' }
        ],
        roles: [
          'Industrial Engineer', 'Operations Research Analyst', 'Supply Chain Systems Architect',
          'Continuous Improvement Lead', 'Logistics Network Planner'
        ]
      }
    ]
  },
  {
    id: 'dept_safety',
    name: 'Safety & Reliability',
    code: 'SAFETY',
    description: 'HAZOP hazard analysis, fail-safe architectures, reliability engineering, and industrial safety.',
    branches: [
      {
        id: 'safety_eng',
        code: 'SAFETY',
        name: 'Safety, Fire & Reliability Engineering',
        specializations: [
          { id: 'spec_safe_hazop', name: 'HAZOP Risk Modeling & Quantitative Risk Assessment' },
          { id: 'spec_safe_fire', name: 'Fire Protection Hydraulics & Suppression Physics' }
        ],
        roles: [
          'Process Safety Engineer', 'Reliability Engineer', 'Risk Assessment Consultant',
          'Fire Protection Specialist', 'Occupational Health and Safety Superintendent'
        ]
      }
    ]
  },
  {
    id: 'dept_printing',
    name: 'Printing & Packaging',
    code: 'PRINT_PACK',
    description: 'Rotogravure/flexography kinetics, barrier packaging materials, and RFID printing.',
    branches: [
      {
        id: 'packaging_eng',
        code: 'PACK',
        name: 'Printing & Packaging Technology',
        specializations: [
          { id: 'spec_pack_barrier', name: 'High-Barrier Biodegradable Packaging Films' },
          { id: 'spec_pack_color', name: 'Digital Color Gamuts & High-Speed Flexography' }
        ],
        roles: [
          'Packaging Development Engineer', 'Print Production Specialist', 'Package Testing Engineer',
          'Sustainable Packaging Specialist', 'Quality Control Superintendent'
        ]
      }
    ]
  },
  {
    id: 'dept_arch',
    name: 'Architecture-related Engineering',
    code: 'ARCH_ENG',
    description: 'Building envelope thermodynamics, architectural acoustics, sustainable HVAC, and daylighting physics.',
    branches: [
      {
        id: 'arch_eng',
        code: 'ARCH_ENG',
        name: 'Architectural Engineering & Building Systems',
        specializations: [
          { id: 'spec_arch_hvac', name: 'Building Energy Modeling & Smart HVAC' },
          { id: 'spec_arch_acoustics', name: 'Architectural Acoustics & Lighting Simulation' }
        ],
        roles: [
          'Architectural Engineer', 'Building Systems Specialist', 'Facade Engineer',
          'Energy Simulation Modeler', 'Acoustics Consultant'
        ]
      }
    ]
  },
  {
    id: 'dept_water',
    name: 'Water & Hydraulic Engineering',
    code: 'WATER',
    description: 'Open channel flow, dam engineering, groundwater aquifers, flood modeling, and desalination.',
    branches: [
      {
        id: 'water_eng',
        code: 'WATER_ENG',
        name: 'Water Resources & Hydraulic Engineering',
        specializations: [
          { id: 'spec_water_hydro', name: 'Hydrologic Modeling & Flood Defense Infrastructure' },
          { id: 'spec_water_desal', name: 'Reverse Osmosis & Membrane Desalination Plants' }
        ],
        roles: [
          'Hydraulic Modeler', 'Water Resources Engineer', 'Coastal Protection Specialist',
          'Desalination Plant Engineer', 'Dam Safety Inspector'
        ]
      }
    ]
  },
  {
    id: 'dept_interdisciplinary',
    name: 'Emerging & Interdisciplinary Technology',
    code: 'EMERGING',
    description: 'Quantum computing, brain-computer interfaces, synthetic biology, and complex systems synthesis.',
    branches: [
      {
        id: 'quantum_eng',
        code: 'QUANTUM',
        name: 'Quantum Engineering & Computing',
        specializations: [
          { id: 'spec_quantum_qiskit', name: 'Quantum Circuits & Quantum Algorithms' },
          { id: 'spec_quantum_hw', name: 'Superconducting Qubits & Cryogenic Control' }
        ],
        roles: [
          'Quantum Software Engineer', 'Quantum Algorithm Researcher',
          'Cryogenic Hardware Specialist', 'Quantum Cryptographer'
        ]
      }
    ]
  },
  {
    id: 'dept_defence',
    name: 'Defence & Security Technology',
    code: 'DEFENCE',
    description: 'Ballistics, electronic warfare, missile aerodynamics, radar cross-section, and battlefield autonomy.',
    branches: [
      {
        id: 'defence_tech',
        code: 'DEFENCE',
        name: 'Defence Technology & Combat Systems',
        specializations: [
          { id: 'spec_def_ew', name: 'Electronic Warfare & Radar Tracking Telemetry' },
          { id: 'spec_def_armored', name: 'Armor Protection & Ballistics Dynamics' }
        ],
        roles: [
          'Defense Systems Engineer', 'Radar and EW Specialist', 'Armament Design Engineer',
          'Tactical Autonomous Systems Engineer', 'Guidance Systems Specialist'
        ]
      }
    ]
  },
  {
    id: 'dept_specialized',
    name: 'Specialized Technology',
    code: 'SPEC_TECH',
    description: 'Ceramics engineering, leather technology, sports engineering, and niche domain engineering.',
    branches: [
      {
        id: 'specialized_tech',
        code: 'SPEC_TECH',
        name: 'Specialized & Industrial Science Technology',
        specializations: [
          { id: 'spec_niche_sensors', name: 'Precision Instrumentation & Specialized Systems' },
          { id: 'spec_niche_mats', name: 'Engineered Composites & Functional Substrates' }
        ],
        roles: [
          'Specialized Systems Engineer', 'Process Formulation Technologist',
          'Quality Standards Specialist', 'Technical Operations Consultant'
        ]
      }
    ]
  }
];

// Flat lookup helpers
export const ALL_BRANCHES = DEPARTMENTS.flatMap(d => d.branches.map(b => ({ ...b, department_id: d.id, department_name: d.name })));

export const ALL_CAREER_ROLES = Array.from(new Set(DEPARTMENTS.flatMap(d => d.branches.flatMap(b => b.roles || []))));

export class TaxonomyEngine {
  static getDepartments() {
    return DEPARTMENTS;
  }

  static getDepartmentById(id) {
    if (!id) return null;
    return DEPARTMENTS.find(d => d.id === id || d.code.toLowerCase() === id.toLowerCase()) || null;
  }

  static getBranchesByDepartment(deptId) {
    const dept = this.getDepartmentById(deptId);
    return dept ? dept.branches : [];
  }

  static getBranchById(id) {
    if (!id) return null;
    const cleanId = id.toLowerCase();
    return ALL_BRANCHES.find(b => b.id === cleanId || b.code.toLowerCase() === cleanId) || null;
  }

  static getSpecializationsByBranch(branchId) {
    const branch = this.getBranchById(branchId);
    return branch ? (branch.specializations || []) : [];
  }

  static getSuggestedRoles(branchId, specId = null) {
    const branch = this.getBranchById(branchId);
    if (!branch) {
      return ['Software Engineer', 'Systems Engineer', 'Engineering Analyst', 'Technical Lead'];
    }
    return branch.roles || [];
  }

  static getAllCareerRoles() {
    return ALL_CAREER_ROLES;
  }

  static searchTaxonomy(query) {
    if (!query || !query.trim()) return DEPARTMENTS;
    const q = query.toLowerCase().trim();
    return DEPARTMENTS.map(dept => {
      const matchDept = dept.name.toLowerCase().includes(q) || dept.code.toLowerCase().includes(q);
      const filteredBranches = dept.branches.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.code.toLowerCase().includes(q) ||
        (b.roles && b.roles.some(r => r.toLowerCase().includes(q))) ||
        (b.specializations && b.specializations.some(s => s.name.toLowerCase().includes(q)))
      );
      if (matchDept || filteredBranches.length > 0) {
        return {
          ...dept,
          branches: matchDept ? dept.branches : filteredBranches
        };
      }
      return null;
    }).filter(Boolean);
  }
}

# 🛥️ River Boat Cleaner (Embedded System & IoT Project)

An autonomous and remote-controlled river cleaning boat prototype developed as a collaborative team project for the Embedded Systems course. This project aims to reduce manual labor in water pollution management by combining IoT communication, sensor processing, and web-based control into a unified platform.

## 👤 My Role & Contributions
As a core member of a 3-person team, I focused entirely on **Software Development and System Testing**. My primary responsibilities included:
*   **Microcontroller Programming:** Wrote and optimized C/C++ code for the Arduino UNO R3 (handling motor controls and ultrasonic sensors) and the ESP32 NodeMCU (managing IoT Cloud communication).
*   **API & Backend Integration:** Assisted in coding and configuring the backend logic to ensure smooth data transmission between the Flask web server (ODROID) and the embedded nodes.
*   **System Testing & Debugging:** Conducted comprehensive end-to-end testing of the hardware-software integration. Troubleshot logic bugs, sensor calibration issues, and network delays to ensure reliable real-time control.
*   **Quality Assurance:** Iteratively tested the autonomous trash detection algorithms and the responsiveness of the conveyor belt mechanisms in real-world simulations.

## ⚙️ System Architecture (Processing Nodes)
The system's workload is distributed across three main processing nodes:

1.  **ODROID-C4 (High-Level Processing & Interface)**
    *   Hosted a Flask web server for the control interface.
    *   Managed live video streaming using OpenCV.
    *   Handled API communication between the web interface and microcontrollers.
2.  **ESP32 NodeMCU (IoT & Cloud Communication)**
    *   Managed Wi-Fi connectivity and data syncing with Arduino IoT Cloud.
    *   Processed environmental data from the DS18B20 Temperature Sensor.
    *   Acted as a command-forwarding bridge between the ODROID and Arduino.
3.  **Arduino UNO R3 (Low-Level Hardware Control)**
    *   Processed spatial data via the HC-SR04 Ultrasonic Sensor for autonomous trash detection.
    *   Controlled boat movement and the conveyor-based garbage collection system via L298N motor drivers.

## 🚀 Key Features
*   **Hybrid Control System:** Manual remote movement control via a web interface alongside autonomous trash detection.
*   **Conveyor Collection:** Automated physical garbage collection mechanism.
*   **Real-time Telemetry:** Environmental and system monitoring integrated with IoT cloud services.
*   **Live Camera Feed:** Real-time video streaming capabilities for remote navigation.

## 🛠️ Technologies & Hardware
*   **Software:** Arduino IDE, C/C++, Python (Flask, OpenCV), Arduino IoT Cloud
*   **Microcontrollers:** ODROID-C4, ESP32 NodeMCU, Arduino UNO R3
*   **Sensors & Actuators:** HC-SR04 Ultrasonic, DS18B20 Temperature Sensor, L298N Motor Driver, DC Motors, Webcam

## 📄 Project Report
The full project report, including detailed schematics, workflows, and test results, can be accessed here:
*   [🔗 View Full Project Report](https://link.psu.th/2mnePP)

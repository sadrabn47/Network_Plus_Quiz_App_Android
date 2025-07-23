import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookOpen, CheckCircle, Moon, RotateCcw, Star, Sun, XCircle } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Appearance,
  ColorSchemeName,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

// --- Type Definitions ---
interface Question {
  question: string;
  choices: string[];
  answers: string[];
  explanation: string;
}

type ScreenName = 'welcome' | 'quiz' | 'results' | 'review';

interface SavedQuizState {
  currentQuestionIndex: number;
  score: number;
  timeLeft: number;
  userAnswers: string[][];
}

// --- Bundled Questions Data ---
const questions: Question[] = [
  {
    "question": "Which of the following types of hubs does not regenerate the signal and therefore is not a repeater?",
    "choices": ["Active hub", "Hybrid hub", "Passive hub", "Switching hub"],
    "answers": ["Passive hub"],
    "explanation": "A passive hub is a simple physical connector that does not have its own power source. It splits the signal to all ports without regenerating or amplifying it, unlike an active hub which acts as a repeater."
  },
  {
    "question": "What is the Microsoft term for a peer-to-peer network?",
    "choices": ["Client-server", "Domain", "Workgroup", "Active Directory"],
    "answers": ["Workgroup"],
    "explanation": "In a Microsoft Windows environment, a 'Workgroup' is a collection of computers on a LAN that share common resources and responsibilities. It's a peer-to-peer model, as there is no central server managing the network."
  },
  {
    "question": "Which type of server is responsible for storing files for users on the network?",
    "choices": ["File and print server", "Web server", "Directory server", "Application server"],
    "answers": ["File and print server"],
    "explanation": "A file and print server is a dedicated server that provides centralized storage for files and manages printing services, allowing network users to access and share these resources."
  },
  {
    "question": "What is the well-known port number for the HTTP service?",
    "choices": ["20", "21", "80", "25"],
    "answers": ["80"],
    "explanation": "Port 80 is the standard, well-known port assigned to the Hypertext Transfer Protocol (HTTP), which is the foundation of data communication for the World Wide Web."
  },
  {
    "question": "Which network service is responsible for assigning IP addresses to systems on the network when they boot up?",
    "choices": ["DNS", "WINS", "DHCP", "Server"],
    "answers": ["DHCP"],
    "explanation": "The Dynamic Host Configuration Protocol (DHCP) is a network management protocol used to automatically assign IP addresses and other network configuration parameters to devices on a network."
  },
  {
    "question": "Which protocol is responsible for sending e-mail across the Internet?",
    "choices": ["POP3", "IMAP4", "HTTP", "SMTP"],
    "answers": ["SMTP"],
    "explanation": "The Simple Mail Transfer Protocol (SMTP) is the standard protocol for sending email messages from a mail client to a mail server and for routing email between mail servers."
  },
  {
    "question": "Which protocol is responsible for connection-oriented communication?",
    "choices": ["TCP", "IP", "UDP", "ICMP"],
    "answers": ["TCP"],
    "explanation": "The Transmission Control Protocol (TCP) is a connection-oriented protocol, meaning it establishes a connection (a three-way handshake) before sending data to ensure reliable, ordered, and error-checked delivery."
  },
  {
    "question": "Which protocol is responsible for error reporting and status information?",
    "choices": ["ICMP", "TCP", "UDP", "IP"],
    "answers": ["ICMP"],
    "explanation": "The Internet Control Message Protocol (ICMP) is used by network devices to send error messages and operational information, such as indicating that a requested service is not available or that a host or router could not be reached."
  },
  {
    "question": "Which protocol is responsible for logical addressing and delivery of packets?",
    "choices": ["ICMP", "TCP", "IP", "UDP"],
    "answers": ["IP"],
    "explanation": "The Internet Protocol (IP) is the principal communications protocol for relaying datagrams across network boundaries. Its primary function is to handle logical addressing (IP addresses) and the routing of packets."
  },
  {
    "question": "Which protocol is defined to use TCP port 23?",
    "choices": ["Telnet", "FTP", "HTTP", "SMTP"],
    "answers": ["Telnet"],
    "explanation": "Telnet is a protocol that provides a command-line interface for communication with a remote device or server, and it traditionally operates over TCP port 23."
  },
  {
    "question": "Which of the following represents an application-layer protocol?",
    "choices": ["SMTP", "IP", "UDP", "TCP"],
    "answers": ["SMTP"],
    "explanation": "SMTP (Simple Mail Transfer Protocol) operates at the Application Layer (Layer 7) of the OSI model. IP, UDP, and TCP are protocols that operate at the lower Transport (Layer 4) and Network (Layer 3) layers."
  },
  {
    "question": "Which utility is used to facilitate file transfers between two remote hosts?",
    "choices": ["FTP", "Telnet", "Ping", "None of the above"],
    "answers": ["FTP"],
    "explanation": "The File Transfer Protocol (FTP) is a standard network protocol used for the transfer of computer files between a client and server on a computer network."
  },
  {
    "question": "Which of the following DHCP settings defines the range of dynamic IP addresses?",
    "choices": ["Exclusions", "Pool", "Reservations", "Scope options"],
    "answers": ["Pool"],
    "explanation": "In DHCP, the 'address pool' (or simply 'pool') is the range of IP addresses within a scope that are available to be leased to client computers on the network."
  },
  {
    "question": "Which of the following is not a layer in the OSI model?",
    "choices": ["Physical", "Transport", "Network", "Data transmission"],
    "answers": ["Data transmission"],
    "explanation": "The OSI model consists of 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. 'Data transmission' is a function of the model, not a distinct layer."
  },
  {
    "question": "Which of the following functions can be performed at layer 6 of the OSI model?",
    "choices": ["Routing of the message", "Compression", "Encryption", "Converting the message to a format that is understood by the destination"],
    "answers": ["Compression", "Encryption", "Converting the message to a format that is understood by the destination"],
    "explanation": "Layer 6, the Presentation Layer, is responsible for data translation, formatting, encryption, and compression. It ensures that data from the application layer of one system is readable by the application layer of another system."
  },
  {
    "question": "Which layer of the OSI model is responsible for converting the packet to an electrical signal that will be placed on the wire?",
    "choices": ["Layer 1", "Layer 4", "Layer 3", "Layer 2"],
    "answers": ["Layer 1"],
    "explanation": "Layer 1, the Physical Layer, is responsible for the transmission and reception of unstructured raw data between a device and a physical transmission medium. It converts digital bits into electrical, radio, or optical signals."
  },
  {
    "question": "Which layer of the OSI model does a router run at?",
    "choices": ["Layer 4", "Layer 1", "Layer 3", "Layer 2"],
    "answers": ["Layer 3"],
    "explanation": "Routers operate at Layer 3, the Network Layer. They use logical addresses (IP addresses) to make decisions about forwarding packets between different networks."
  },
  {
    "question": "Which of the following layers does a gateway run at?",
    "choices": ["Layer 4", "Layer 1", "Layer 5", "All layers"],
    "answers": ["All layers"],
    "explanation": "A gateway is a device that connects dissimilar networks. Because it may need to translate protocols at multiple levels, it can operate at all seven layers of the OSI model, from the Physical Layer up to the Application Layer."
  },
  {
    "question": "Which layer of the OSI model does the IP protocol run at?",
    "choices": ["Layer 2", "Layer 3", "Layer 4", "Layer 5"],
    "answers": ["Layer 3"],
    "explanation": "The Internet Protocol (IP) is the primary protocol at the Network Layer (Layer 3) of the OSI model, responsible for logical addressing and routing."
  },
  {
    "question": "Which of the following describes the function of Layer 3 of the OSI model?",
    "choices": ["It provides sequencing and acknowledgments for connection-oriented communication.", "It provides connectionless communication using logical addressing.", "It provides error detection through the FCS for frames transmitted.", "It provides encryption and compression for data received."],
    "answers": ["It provides connectionless communication using logical addressing."],
    "explanation": "Layer 3, the Network Layer, is responsible for path determination and logical addressing (IP addresses). It provides the means for forwarding packets from a source to a destination across multiple networks."
  },
  {
    "question": "Which of the following statements about the OSI model is true?",
    "choices": ["The application layer does not need to know what type of network is being used because that is dealt with by a layer below it.", "The network layer deals with the network cabling and network device interface compatibility.", "The transport layer deals with how the data is transported from one router to another based on the IP header.", "The model consists of four layers that describe the requirements a technician follows to troubleshoot and support a network."],
    "answers": ["The application layer does not need to know what type of network is being used because that is dealt with by a layer below it."],
    "explanation": "The OSI model's layered approach means each layer provides services to the layer above it and abstracts the details of the layers below it. The Application Layer can function without knowing the underlying network technology."
  },
  {
    "question": "Which of the following protocols are layer-3 protocols?",
    "choices": ["ICMP", "TCP", "IP", "UDP"],
    "answers": ["ICMP", "IP"],
    "explanation": "Both the Internet Protocol (IP) and the Internet Control Message Protocol (ICMP) operate at Layer 3 (the Network Layer). TCP and UDP are Layer 4 (Transport Layer) protocols."
  },
  {
    "question": "Your team is troubleshooting connectivity issues, and your coworker has asked you what the layer-2 address of one of the laptops on the network is. Which of the following addresses would you give?",
    "choices": ["COMPUTER1", "00-02-3F-6B-25-13", "192.168.3.200", "www.gleneclarke.com"],
    "answers": ["00-02-3F-6B-25-13"],
    "explanation": "A Layer 2 address is a physical or MAC (Media Access Control) address. It is a unique identifier assigned to a network interface controller (NIC) and is represented as a set of six hexadecimal pairs."
  },
  {
    "question": "Which of the following protocols are transport-layer protocols?",
    "choices": ["ICMP", "TCP", "IP", "UDP"],
    "answers": ["TCP", "UDP"],
    "explanation": "Both the Transmission Control Protocol (TCP) and the User Datagram Protocol (UDP) operate at Layer 4, the Transport Layer. They are responsible for end-to-end communication between hosts."
  },
  {
    "question": "You need to configure one of the routers in the office with a layer-3 address. Which of the following addresses would you use?",
    "choices": ["COMPUTER1", "00-02-3F-6B-25-13", "192.168.3.200", "www.gleneclarke.com"],
    "answers": ["192.168.3.200"],
    "explanation": "A Layer 3 address is a logical address, most commonly an IP address. '192.168.3.200' is an example of an IPv4 address used for routing packets across networks."
  },
  {
    "question": "Which of the following protocols are layer-4 protocols?",
    "choices": ["TCP", "IP", "ARP", "UDP"],
    "answers": ["TCP", "UDP"],
    "explanation": "TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) are the two primary protocols at Layer 4, the Transport Layer. They manage the data flow between two hosts."
  },
  {
    "question": "Which protocol is responsible for converting the IP address to a MAC address?",
    "choices": ["IP", "TCP", "ARP", "ICMP"],
    "answers": ["ARP"],
    "explanation": "The Address Resolution Protocol (ARP) is used to resolve a Layer 3 (IP) address to a Layer 2 (MAC) address, which is necessary for devices to communicate on a local network."
  },
  {
    "question": "Which dynamic routing protocol is a distance vector protocol?",
    "choices": ["OSPF", "DIP", "RIP", "NIP"],
    "answers": ["RIP"],
    "explanation": "The Routing Information Protocol (RIP) is a distance-vector routing protocol, which means it determines the best route to a destination based on the number of hops (routers) it must pass through."
  },
  {
    "question": "Which dynamic routing protocol monitors the state of the links?",
    "choices": ["OSPF", "SIP", "RIP", "SLIP"],
    "answers": ["OSPF"],
    "explanation": "Open Shortest Path First (OSPF) is a link-state routing protocol. It maintains a detailed database of the network topology and calculates the shortest path based on the state (cost, bandwidth, etc.) of the links."
  },
  {
    "question": "What type of NAT allows a number of internal systems to use the same public IP address?",
    "choices": ["Static NAT", "SNAT", "TNAT", "NAT overloading"],
    "answers": ["NAT overloading"],
    "explanation": "NAT overloading, also known as Port Address Translation (PAT), allows multiple devices on a private network to be mapped to a single public IP address. It tracks connections using port numbers."
  },
  {
    "question": "What mechanism does NAT use to allow multiple systems on the network to use the same public IP address when connecting to the Internet?",
    "choices": ["SNAT", "PAT", "TNAT", "JNAT"],
    "answers": ["PAT"],
    "explanation": "Port Address Translation (PAT) is the mechanism used in NAT overloading. It modifies the source port number for outgoing packets so that a single public IP address can be shared among multiple private IP addresses."
  },
  {
    "question": "What type of NAT involves having a single public IP address mapped to a single private address?",
    "choices": ["Static NAT", "PAT", "TNAT", "NAT overloading"],
    "answers": ["Static NAT"],
    "explanation": "Static NAT creates a one-to-one mapping between a private IP address and a public IP address. This is often used to make an internal server (like a web server) accessible from the internet."
  },
  {
    "question": "Router A learns the same route from two different neighbors, one of the neighbor routers is an OSPF neighbor and the other is an EIGRP neighbor. What is the administrative distance of the route that will be installed in the routing table?",
    "choices": ["20", "90", "110", "115"],
    "answers": ["90"],
    "explanation": "Administrative Distance (AD) is used by routers to select the best path when there are two or more different routes to the same destination from two different routing protocols. EIGRP has a default AD of 90, and OSPF has an AD of 110. The router will prefer the route with the lower AD, which is EIGRP (90)."
  },
  {
    "question": "Which utility can be used to display and modify the table that maintains the TCP/IP address-to-MAC address translation?",
    "choices": ["NBTSTAT", "Telnet", "ARP", "SNMP"],
    "answers": ["ARP"],
    "explanation": "The `arp` command-line utility is used to view and manage the Address Resolution Protocol (ARP) cache, which stores the mappings of IP addresses to MAC addresses."
  },
  {
    "question": "How many bits in an IP address?",
    "choices": ["8 bits", "32 bits", "48 bits", "96 bits"],
    "answers": ["32 bits"],
    "explanation": "An IPv4 (Internet Protocol version 4) address is a 32-bit number. This allows for approximately 4.3 billion unique addresses."
  },
  {
    "question": "How many octets in an IP address?",
    "choices": ["1", "2", "3", "4"],
    "answers": ["4"],
    "explanation": "A 32-bit IPv4 address is divided into four 8-bit sections, called octets. Each octet is represented as a decimal number from 0 to 255."
  },
  {
    "question": "A computer with a subnet mask of 255.255.255.0 has how many octets for the network ID?",
    "choices": ["1", "2", "3", "4"],
    "answers": ["3"],
    "explanation": "The subnet mask 255.255.255.0 indicates that the first three octets (24 bits) represent the network portion of the address, and the last octet (8 bits) represents the host portion."
  },
  {
    "question": "A computer with the IP address of 134.67.89.12 and a subnet mask of 255.255.0.0 is on the same network with which of the following systems?",
    "choices": ["134.76.89.11", "134.67.112.23", "13.4.67.34", "109.67.45.10"],
    "answers": ["134.67.112.23"],
    "explanation": "The subnet mask 255.255.0.0 means the network ID is the first two octets. The network ID is 134.67. Any other IP address starting with 134.67 will be on the same network."
  },
  {
    "question": "Which network address class supports 65,534 hosts?",
    "choices": ["Class A", "Class B", "Class C", "Class D"],
    "answers": ["Class B"],
    "explanation": "A Class B network uses 16 bits for the host portion, which allows for 2^16 - 2 = 65,534 usable host addresses. (The -2 is for the network ID and broadcast address)."
  },
  {
    "question": "What is the default subnet mask for a class C network?",
    "choices": ["255.0.0.0", "225.225.0.0", "255.255.255.0", "225.255.255.255"],
    "answers": ["255.255.255.0"],
    "explanation": "In classful networking, a Class C network allocates 24 bits for the network ID and 8 bits for the host ID, resulting in a default subnet mask of 255.255.255.0."
  },
  {
    "question": "Which address is reserved for internal loopback functions?",
    "choices": ["0.0.0.0", "1.0.0.1", "121.0.0.1", "127.0.0.1"],
    "answers": ["127.0.0.1"],
    "explanation": "The address 127.0.0.1 is the standard loopback address. Packets sent to this address are routed back to the local machine, which is useful for testing network software without a physical network connection."
  },
  {
    "question": "Which of the following addresses is a private IP address?",
    "choices": ["10.0.0.34", "191.167.34.5", "172.16.7.99", "12.108.56.7"],
    "answers": ["10.0.0.34", "172.16.7.99"],
    "explanation": "Private IP address ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. Both 10.0.0.34 and 172.16.7.99 fall within these ranges and are not routable on the public internet."
  },
  {
    "question": "What is the subnet mask for 171.103.2.30?",
    "choices": ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
    "answers": ["255.255.0.0"],
    "explanation": "The IP address 171.103.2.30 falls into the Class B range (128-191 in the first octet). The default subnet mask for a Class B network is 255.255.0.0."
  },
  {
    "question": "You have a network ID of 131.107.0.0 and you would like to subnet your network into six networks. What is your new subnet mask?",
    "choices": ["255.224.0.0", "255.255.224.0", "255.255.192.0", "255.255.192.0"],
    "answers": ["255.255.224.0"],
    "explanation": "To get at least six subnets, you need to borrow 3 bits from the host portion (2^3 = 8 subnets). The original Class B mask is /16. Borrowing 3 bits makes it a /19 mask. A /19 mask is 255.255.224.0."
  },
  {
    "question": "You want to divide your network into eight networks. How many bits will you need to take from the host ID portion of the subnet mask?",
    "choices": ["2", "3", "4", "6"],
    "answers": ["3"],
    "explanation": "To create subnets, you use the formula 2^n, where n is the number of bits borrowed. To get 8 networks, you need to solve 2^n = 8. Since 2^3 = 8, you need to borrow 3 bits."
  },
  {
    "question": "In binary, how do you calculate the broadcast address of a network range?",
    "choices": ["All host bits set to 0", "All host bits set to 0, except for the low-order bit", "All host bits set to 1, except for the low-order bit", "All host bits set to 1"],
    "answers": ["All host bits set to 1"],
    "explanation": "The broadcast address for a given subnet is calculated by setting all the bits in the host portion of the address to 1. This address is used to send a message to all devices on that specific subnet."
  },
  {
    "question": "In binary, how do you calculate the network ID of a network range?",
    "choices": ["All host bits set to 0", "All host bits set to 0, except for the low-order bit", "All host bits set to 1, except for the low-order bit", "All host bits set to 1"],
    "answers": ["All host bits set to 0"],
    "explanation": "The network ID (or network address) for a given subnet is calculated by setting all the bits in the host portion of the address to 0. This address identifies the subnet itself."
  },
  {
    "question": "The last valid address of a subnet is always:",
    "choices": ["One more than the broadcast address", "One less than the broadcast address", "One more than the network ID", "One less than the network ID"],
    "answers": ["One less than the broadcast address"],
    "explanation": "In any subnet, the very last address is the broadcast address, which cannot be assigned to a host. Therefore, the last *valid* or *usable* host address is the one right before the broadcast address."
  },
  {
    "question": "Which of the following is an example of CIDR notation?",
    "choices": ["16/10.34.56.78", "10.34.56.78", "10.34.56.0", "10.34.56.78/16"],
    "answers": ["10.34.56.78/16"],
    "explanation": "Classless Inter-Domain Routing (CIDR) notation appends a slash (/) and the number of bits in the network prefix to the IP address. For example, /16 means the first 16 bits are the network portion."
  },
  {
    "question": "Your router has the IP address of 216.83.11.65/27. You wish to connect a new system on the network. Which of the following addresses would you assign to that new system?",
    "choices": ["216.83.11.45", "216.83.11.87", "216.83.11.95", "216.83.11.96"],
    "answers": ["216.83.11.87"],
    "explanation": "A /27 subnet has 32 addresses per subnet. The subnet for 216.83.11.65 is 216.83.11.64. The valid host range for this subnet is .65 to .94. The address .95 is the broadcast address, and .96 is the start of the next subnet."
  },
  {
    "question": "Which of the following would be the MOST efficient subnet mask for a point-to-point link?",
    "choices": ["/28", "/29", "/31", "/32"],
    "answers": ["/31"],
    "explanation": "A point-to-point link only needs two addresses. A /30 mask provides two usable addresses but wastes two (network ID and broadcast). A /31 mask, as defined in RFC 3021, is the most efficient, providing exactly two addresses and conserving IP space. While /32 is a host route, it's not typically used for the link itself."
  },
  {
    "question": "Which of the following answers lists the dotted-decimal notation (DDN) equivalent of /30?",
    "choices": ["255.255.255.192", "255.255.255.252", "255.255.255.240", "255.255.254.0"],
    "answers": ["255.255.255.252"],
    "explanation": "A /30 prefix means 30 of the 32 bits are set to 1 in the subnet mask. In the last octet, this means the first 6 bits are 1s (11111100), which equals 252 in decimal. Thus, the mask is 255.255.255.252."
  },
  {
    "question": "Which of the following statements is true about classless IP addressing concepts?",
    "choices": ["Uses a 128-bit IP address", "Applies only for Class A and B networks", "Separates IP addresses into network, subnet, and host parts", "Ignores Class A, B, and C network rules"],
    "answers": ["Ignores Class A, B, and C network rules"],
    "explanation": "Classless Inter-Domain Routing (CIDR) was developed to replace the classful network architecture. It ignores the old Class A, B, and C rules and allows the network/host boundary to be set anywhere, providing more flexibility and efficiency."
  },
  {
    "question": "Which of the following masks, when used as the only mask within a Class B network, would supply enough subnet bits to support 100 subnets?",
    "choices": ["/24", "255.255.255.252", "/20", "255.255.252.0"],
    "answers": ["/24"],
    "explanation": "A Class B network starts with a /16 mask. To support 100 subnets, you need to borrow 'n' bits where 2^n >= 100. 2^6=64 (not enough), 2^7=128 (enough). So you need to borrow 7 bits. 16 (original bits) + 7 (borrowed bits) = 23. Therefore, a /23 mask (255.255.254.0) would be the most efficient. Of the choices, /24 provides 8 borrowed bits (2^8=256 subnets), which is sufficient."
  },
  {
    "question": "Which of the following is the resident subnet ID for IP address 10.7.99.133/24?",
    "choices": ["10.0.0.0", "10.7.0.0", "10.7.99.0", "10.7.99.128"],
    "answers": ["10.7.99.0"],
    "explanation": "A /24 mask means the first 24 bits (the first three octets) represent the network. Therefore, the network ID is found by setting the host portion (the last octet) to zero, which gives 10.7.99.0."
  },
  {
    "question": "Which of the following is the resident subnet for IP address 192.168.44.97/30?",
    "choices": ["192.168.44.0", "192.168.44.64", "192.168.44.96", "192.168.44.128"],
    "answers": ["192.168.44.96"],
    "explanation": "A /30 mask creates subnets with 4 addresses each. The subnets in the last octet are .0, .4, .8, ... .92, .96, .100, etc. The IP address 192.168.44.97 falls into the range that starts with the network ID 192.168.44.96."
  },
  {
    "question": "Which of the following is the subnet broadcast address for the subnet in which IP address 172.31.77.201/27 resides?",
    "choices": ["172.31.201.255", "172.31.255.255", "172.31.77.223", "172.31.77.207"],
    "answers": ["172.31.77.223"],
    "explanation": "A /27 mask creates subnets with 32 addresses. For the IP 172.31.77.201, the network ID is 172.31.77.192. The next subnet starts at .224. Therefore, the broadcast address for the .192 subnet is the address right before the next subnet, which is 172.31.77.223."
  },
  {
    "question": "A fellow engineer tells you to configure the DHCP server to lease the last 100 usable IP addresses in subnet 10.1.4.0/23. Which of the following IP addresses could be leased as a result of your new configuration?",
    "choices": ["10.1.4.156", "10.1.4.254", "10.1.5.200", "10.1.7.200"],
    "answers": ["10.1.5.200"],
    "explanation": "A /23 subnet for 10.1.4.0 covers the range 10.1.4.0 to 10.1.5.255. The last usable address is 10.1.5.254. The last 100 usable addresses would be from 10.1.5.155 to 10.1.5.254. The address 10.1.5.200 falls within this range."
  },
  {
    "question": "A network administrator is configuring the 172.16.40.0/22 network for a new building. Which of the following is the number of hosts that will be supported on this network?",
    "choices": ["510", "512", "1022", "1024"],
    "answers": ["1022"],
    "explanation": "A /22 mask leaves 10 bits for the host portion (32 - 22 = 10). The number of possible hosts is 2^10 = 1024. We subtract 2 (for the network ID and broadcast address), leaving 1022 usable host addresses."
  },
  {
    "question": "Which wireless mode involves two laptops connecting directly to one another?",
    "choices": ["Infrastructure mode", "Ad hoc mode", "Laptop mode", "Enterprise mode"],
    "answers": ["Ad hoc mode"],
    "explanation": "Ad hoc mode is a peer-to-peer wireless network framework where devices communicate directly with each other without relying on a central access point (AP)."
  },
  {
    "question": "A company has offices in Halifax and Toronto. Both networks are connected to allow the two locations to communicate. This is considered what type of network?",
    "choices": ["LAN", "JAN", "MAN", "WAN"],
    "answers": ["WAN"],
    "explanation": "A Wide Area Network (WAN) is a network that spans a large geographical area, such as across cities, states, or countries. Connecting offices in Halifax and Toronto would require a WAN."
  },
  {
    "question": "The physical layout of computers, cables, and other components on a network is known as what?",
    "choices": ["Segment", "Backbone", "Topology", "Protocol"],
    "answers": ["Topology"],
    "explanation": "Network topology refers to the arrangement of the elements (links, nodes, etc.) of a communication network. It can describe both the physical and logical arrangement of the network."
  },
  {
    "question": "Which topology has a centralized location in which all of the cables come together to a central point such that a failure at this point brings down the entire network?",
    "choices": ["Bus", "Star", "Mesh", "Ring"],
    "answers": ["Star"],
    "explanation": "In a star topology, all devices are connected to a central hub or switch. While a single cable failure only affects one device, a failure of the central device will take down the entire network segment."
  },
  {
    "question": "Which topology has a layout in which every workstation or peripheral has a direct connection to every other workstation or peripheral on the network?",
    "choices": ["Bus", "Star", "Mesh", "Ring"],
    "answers": ["Mesh"],
    "explanation": "A full mesh topology is one where every node is connected directly to every other node. This provides high redundancy but is expensive and complex to implement."
  },
  {
    "question": "Which of the following network topologies is primarily used to connect servers to large network disk arrays?",
    "choices": ["SAN", "MAN", "CAN", "PAN"],
    "answers": ["SAN"],
    "explanation": "A Storage Area Network (SAN) is a dedicated, high-speed network that provides block-level network access to consolidated storage. It is commonly used to connect servers to storage devices like disk arrays and tape libraries."
  },
  {
    "question": "Which of the following wireless standards does not fall into the Wi-Fi standard?",
    "choices": ["802.11n", "802.11g", "802.11b", "802.11a"],
    "answers": ["802.11a"],
    "explanation": "While 802.11a is an official IEEE wireless standard, the 'Wi-Fi' certification, managed by the Wi-Fi Alliance, initially focused on the more common 2.4 GHz standards (b/g/n) for interoperability. 802.11a operates in the 5 GHz band and had less initial consumer adoption."
  },
  {
    "question": "Which wireless standard runs at 54 Mbps per second at the 2.4 GHz frequency?",
    "choices": ["802.11n", "802.11a", "802.11g", "802.11b"],
    "answers": ["802.11g"],
    "explanation": "The 802.11g standard provides a maximum data rate of 54 Mbps and operates in the 2.4 GHz frequency band. It is backward compatible with 802.11b."
  },
  {
    "question": "Which wireless standard can reach transfer rates of up to 600 Mbps?",
    "choices": ["802.11n", "802.11a", "802.11g", "802.11b"],
    "answers": ["802.11n"],
    "explanation": "The 802.11n standard introduced technologies like MIMO (Multiple Input, Multiple Output) which allowed for theoretical maximum speeds of up to 600 Mbps."
  },
  {
    "question": "Which wireless security protocol changes the key using TKIP?",
    "choices": ["WEP", "WPA", "WEP2", "WPA5"],
    "answers": ["WPA"],
    "explanation": "Wi-Fi Protected Access (WPA) was created as an interim security improvement over WEP. It uses the Temporal Key Integrity Protocol (TKIP) to dynamically generate new keys for each packet, making it more secure than WEP's static key."
  },
  {
    "question": "Which of the following is the name you assign to your wireless network?",
    "choices": ["MAC address", "Service Set Identifier (SSID)", "WEP key", "IP address"],
    "answers": ["Service Set Identifier (SSID)"],
    "explanation": "The Service Set Identifier (SSID) is the public name of a wireless local area network (WLAN). It is the name you see when you scan for available Wi-Fi networks."
  },
  {
    "question": "What should you do with the wireless router to help hide the wireless network from unauthorized users?",
    "choices": ["Turn it off when it is not being used.", "Enable WEP.", "Disable SSID broadcasting.", "Unplug the network cable from the router."],
    "answers": ["Disable SSID broadcasting."],
    "explanation": "Disabling the SSID broadcast stops the router from publicly advertising the network's name. While not a strong security measure on its own (the network can still be found with scanning tools), it does hide it from casual view."
  },
  {
    "question": "Which 802 project standard defines wireless at speeds of 54 Mbps and a frequency range of 2.4 GHz?",
    "choices": ["802.11a", "802.11b", "802.11c", "802.11g"],
    "answers": ["802.11g"],
    "explanation": "The IEEE 802.11g standard operates in the 2.4 GHz band and provides a maximum theoretical data rate of 54 Mbps, combining the speed of 802.11a with the frequency band of 802.11b."
  },
  {
    "question": "A wireless technician needs to deploy a single 802.11 standard that supports both 2.4GHz and 5GHz frequencies with up to 40MHz channel widths. Which of the following wireless standards should the technician configure?",
    "choices": ["ac", "b", "g", "n"],
    "answers": ["n"],
    "explanation": "The 802.11n standard is dual-band, meaning it can operate on both the 2.4 GHz and 5 GHz frequencies. It also introduced 40MHz channel widths for increased throughput."
  },
  {
    "question": "A network technician is working on a new wireless project. The network manager has a primary requirement of achieving speeds of at least 1 Gbps when connected. Which of the following standards would be appropriate for the technician to implement?",
    "choices": ["802.11a", "802.11ac", "802.11b", "802.11n"],
    "answers": ["802.11ac"],
    "explanation": "The 802.11ac standard (also known as Wi-Fi 5) operates in the 5 GHz band and is designed for high-throughput, with theoretical speeds well over 1 Gbps, making it suitable for this requirement."
  },
  {
    "question": "Which 802 project standard defines Gigabit Ethernet using fiber-optic cabling?",
    "choices": ["802.5", "802.3z", "802.3ab", "802.11g"],
    "answers": ["802.3z"],
    "explanation": "The IEEE 802.3z standard is the specification for Gigabit Ethernet over fiber-optic cable, commonly known as 1000BASE-SX, 1000BASE-LX, etc."
  },
  {
    "question": "Which 802 project standard defines Fast Ethernet?",
    "choices": ["802.3u", "802.3z", "802.3ab", "802.11g"],
    "answers": ["802.3u"],
    "explanation": "The IEEE 802.3u standard defines Fast Ethernet, which operates at 100 Mbps. This includes specifications like 100BASE-TX (over copper) and 100BASE-FX (over fiber)."
  },
  {
    "question": "Which 802 project standard defines 10-Gigabit Ethernet?",
    "choices": ["802.3z", "802.3ae", "802.3ab", "802.11g"],
    "answers": ["802.3ae"],
    "explanation": "The IEEE 802.3ae standard was developed to define Ethernet operating at 10 Gigabits per second, primarily over fiber-optic cabling."
  },
  {
    "question": "What is the maximum distance of CAT 5 UTP cabling?",
    "choices": ["100 meters", "185 meters", "250 meters", "500 meters"],
    "answers": ["100 meters"],
    "explanation": "For Ethernet standards like 100BASE-TX and 1000BASE-T, the maximum specified length for a single segment of Unshielded Twisted Pair (UTP) cabling, including CAT 5, is 100 meters (328 feet)."
  },
  {
    "question": "You wish to install a 100BaseT network. What type of cabling will you use?",
    "choices": ["CAT 3 UTP", "CAT 5 UTP", "Thinnet", "Fiber-optic"],
    "answers": ["CAT 5 UTP"],
    "explanation": "100BaseT (specifically 100BASE-TX, the most common variant) requires at least Category 5 (CAT 5) Unshielded Twisted Pair (UTP) cabling to support its 100 Mbps speed."
  },
  {
    "question": "Fiber-optic cabling uses which types of connectors?",
    "choices": ["SC", "RJ-45", "BNC", "ST"],
    "answers": ["SC", "ST"],
    "explanation": "ST (Straight Tip) and SC (Subscriber Connector) are two common types of connectors used for fiber-optic cables. RJ-45 is for twisted-pair copper, and BNC is for coaxial cable."
  },
  {
    "question": "What is the maximum distance of single-mode fiber (SMF)?",
    "choices": ["300 meters", "500 meters", "2 kilometers", "850 meters"],
    "answers": ["2 kilometers"],
    "explanation": "Single-mode fiber (SMF) has a smaller core and allows only one mode of light to propagate, which reduces dispersion and allows for much longer transmission distances, often many kilometers, depending on the standard and equipment."
  },
  {
    "question": "You want to create a crossover cable to connect two systems directly together. Which wires would you have to switch at one end of the cable?",
    "choices": ["Wires 1 and 2 with wires 3 and 6", "Wires 2 and 3 with wires 6 and 8", "Wires 1 and 2 with wires 3 and 4", "Wires 2 and 3 with wires 3 and 6"],
    "answers": ["Wires 1 and 2 with wires 3 and 6"],
    "explanation": "To create a T568B crossover cable, the transmit pins (1 and 2) on one end are connected to the receive pins (3 and 6) on the other end. This allows two similar devices (like two PCs) to communicate directly."
  },
  {
    "question": "Which network architecture uses single-mode fiber-optic cabling?",
    "choices": ["1000BaseLX", "1000BaseSX", "1000BaseCX", "1000BaseTX"],
    "answers": ["1000BaseLX"],
    "explanation": "1000BaseLX is a Gigabit Ethernet standard that uses a long-wavelength laser over both single-mode and multi-mode fiber. It is designed for long-distance backbone connections."
  },
  {
    "question": "Which type of cabling is used in a 10BaseFL network?",
    "choices": ["STP", "CAT 3 UTP", "Thinnet", "Fiber-optic"],
    "answers": ["Fiber-optic"],
    "explanation": "The 'F' in 10BaseFL stands for Fiber. It is an Ethernet standard that specifies 10 Mbps networking over fiber-optic cable."
  },
  {
    "question": "A technician recently ran a new cable over fluorescent lighting. Assuming the technician used the appropriate cables, which of the following connectors should be used to terminate it?",
    "choices": ["RJ11", "LC", "BNC", "F-type"],
    "answers": ["LC"],
    "explanation": "Fluorescent lights cause significant electromagnetic interference (EMI). Fiber-optic cable is immune to EMI. The LC (Lucent Connector) is a common, small form-factor connector for fiber-optic cables."
  },
  {
    "question": "A network technician is installing a network printer in a factory setting. The connection from the switch contains an LC connector, yet the printer only supports an RJ45 connector. Which of the following should the technician use?",
    "choices": ["Range extender", "Media converter", "Multilayer switch", "Load balancer"],
    "answers": ["Media converter"],
    "explanation": "A media converter is a device designed to convert a signal from one type of media to another. In this case, it would convert the fiber-optic signal (from the LC connector) to an electrical signal for the copper Ethernet port (RJ45)."
  },
  {
    "question": "Which Gigabit architecture uses multimode fiber cabling?",
    "choices": ["1000BaseLX", "1000BaseSX", "1000BaseCX", "1000BaseTX"],
    "answers": ["1000BaseSX"],
    "explanation": "1000BaseSX is a Gigabit Ethernet standard that uses a shorter wavelength laser over multimode fiber optic cable, typically for shorter distances within a building or campus."
  },
  {
    "question": "Which of the following WAN transmission mediums is the fastest and can travel the longest distance?",
    "choices": ["Satellite", "Copper", "Wireless", "Fiber"],
    "answers": ["Fiber"],
    "explanation": "Fiber-optic cable transmits data as pulses of light, which allows for extremely high bandwidth and very long transmission distances with minimal signal degradation compared to copper, wireless, or satellite."
  },
  {
    "question": "Which type of device is responsible for connecting dissimilar networking environments together?",
    "choices": ["Router", "Bridge", "Gateway", "Switch"],
    "answers": ["Router"],
    "explanation": "A router is a Layer 3 device that connects different networks together (e.g., your home LAN to the internet WAN). It makes forwarding decisions based on IP addresses."
  },
  {
    "question": "Which networking device is used to block unauthorized traffic from entering the network?",
    "choices": ["Bridge", "Gateway", "Switch", "Firewall"],
    "answers": ["Firewall"],
    "explanation": "A firewall is a network security device that monitors incoming and outgoing network traffic and decides whether to allow or block specific traffic based on a defined set of security rules."
  },
  {
    "question": "You wish to enable the interface on the Cisco router; what command would you use?",
    "choices": ["Shutdown", "Enable", "Disable", "No shutdown"],
    "answers": ["No shutdown"],
    "explanation": "In Cisco IOS, interfaces are administratively down by default. To enable an interface, you must enter interface configuration mode and use the `no shutdown` command."
  },
  {
    "question": "What type of device analyzes packets that attempt to enter the network and then either allows or denies the traffic, based on rules?",
    "choices": ["Encryption", "Firewall", "Router", "None of the above"],
    "answers": ["Firewall"],
    "explanation": "This describes the core function of a firewall. It acts as a barrier, inspecting packets against a set of security rules (an access control list) to protect a trusted internal network from an untrusted external network."
  },
  {
    "question": "A user believes a work email account has been compromised. A technician discovers that an email seeming to be from the user's bank shares the same origin IP address as the last login to the email account. Which of the following types of attack is described in this scenario?",
    "choices": ["Spam", "Ransomware", "Man-in-the-middle", "Phishing"],
    "answers": ["Man-in-the-middle"],
    "explanation": "This scenario suggests a Man-in-the-Middle (MITM) attack, where the attacker has intercepted the communication channel. By controlling the channel, they can both monitor logins and inject malicious content (like a phishing email) that appears to be from a legitimate source."
  },
  {
    "question": "What type of attack involves the hacker altering the source address of a packet?",
    "choices": ["Buffer overflow", "Dictionary attack", "Social engineering attack", "Spoof attack"],
    "answers": ["Spoof attack"],
    "explanation": "A spoofing attack is one where an attacker falsifies data to impersonate another device or user. IP spoofing, where the source IP address of a packet is forged, is a common example."
  },
  {
    "question": "What type of password attack involves using dictionary words and appending numbers to the end of those words?",
    "choices": ["Brute-force", "Dictionary", "Hybrid", "Buffer"],
    "answers": ["Hybrid"],
    "explanation": "A hybrid attack combines a dictionary attack with a brute-force attack. It starts with dictionary words and then systematically adds numbers, symbols, or changes capitalization, making it more effective than a simple dictionary attack."
  },
  {
    "question": "Which of the following symbols indicates that you are in priv exec mode?",
    "choices": [">", "#", "$", "&"],
    "answers": ["#"],
    "explanation": "In Cisco IOS, the `>` symbol indicates user EXEC mode, which has limited commands. The `#` symbol indicates privileged EXEC mode (or 'enable mode'), which allows access to all router commands and configuration modes."
  },
  {
    "question": "Which of the following commands would you use to assign an IP address to an interface?",
    "choices": ["Router(config-if)# ip address 10.0.0.1 255.0.0.0", "Router(config)# ip address 10.0.0.1 255.0.0.0", "Router# ip address 10.0.0.1 255.0.0.0", "Router> ip address 10.0.0.1 255.0.0.0"],
    "answers": ["Router(config-if)# ip address 10.0.0.1 255.0.0.0"],
    "explanation": "To assign an IP address in Cisco IOS, you must first enter global configuration mode (`configure terminal`), then interface configuration mode (`interface [name]`), and then use the `ip address [ip] [subnet mask]` command. The `Router(config-if)#` prompt indicates you are in the correct mode."
  },
  {
    "question": "You want to ensure that the network interface on the router is using full duplex. What command would you use?",
    "choices": ["Router(config)# duplex full", "Router(config-if)# duplex half", "Router(config-if)# duplex full", "Router(config-if)# full duplex"],
    "answers": ["Router(config-if)# duplex full"],
    "explanation": "The `duplex` command is configured within the interface configuration mode (`config-if`). The command `duplex full` sets the interface to operate in full-duplex mode, allowing it to send and receive data simultaneously."
  },
  {
    "question": "Which option of IPCONFIG is used to receive a new lease on your IP address?",
    "choices": ["/all", "/release", "/obtain", "/renew"],
    "answers": ["/renew"],
    "explanation": "In the Windows command prompt, `ipconfig /renew` sends a request to the DHCP server to renew the current IP address lease. If the current lease has expired, it will request a new one."
  },
  {
    "question": "You are troubleshooting to determine why Sue’s computer cannot connect to the Internet. What command would you type to view all of Sue’s TCP/IP settings in a Windows command prompt?",
    "choices": ["IPCONFIG", "IPCONFIG /ALL", "IPCONFIG /SHOWITALL", "IPCONFIG /DISPLAYALL"],
    "answers": ["IPCONFIG /ALL"],
    "explanation": "The `ipconfig /all` command in Windows displays the full TCP/IP configuration for all network adapters, including the IP address, subnet mask, default gateway, DNS servers, and MAC address."
  }
];

const QUIZ_STATE_KEY = 'quizState';

// --- Main App Component for the Screen ---
export default function QuizScreen() {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<ColorSchemeName>(systemTheme);
  const [screen, setScreen] = useState<ScreenName>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[][]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes
  const [hasPreviousQuiz, setHasPreviousQuiz] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const colors = theme === 'dark' ? darkTheme : lightTheme;

  // --- Effects ---
  useEffect(() => {
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // Check for a saved quiz state on initial load
    const loadSavedState = async () => {
      const savedState = await loadState();
      if (savedState && savedState.userAnswers.length > 0) {
        setHasPreviousQuiz(true);
      }
    };
    loadSavedState();
  }, []);

  useEffect(() => {
    // Manage the quiz timer
    if (screen === 'quiz' && !isAnswerSubmitted) {
      startTimer();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current)
    };
  }, [screen, currentQuestionIndex, isAnswerSubmitted]);

  // --- Functions ---
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          finishQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // --- State Persistence ---
  const saveState = async (state: SavedQuizState) => {
    try {
      const jsonState = JSON.stringify(state);
      await AsyncStorage.setItem(QUIZ_STATE_KEY, jsonState);
    } catch (e) {
      console.error("Failed to save state.", e);
    }
  };

  const loadState = async (): Promise<SavedQuizState | null> => {
    try {
      const jsonState = await AsyncStorage.getItem(QUIZ_STATE_KEY);
      return jsonState != null ? JSON.parse(jsonState) : null;
    } catch (e) {
      console.error("Failed to load state.", e);
      return null;
    }
  };

  const clearState = async () => {
    try {
      await AsyncStorage.removeItem(QUIZ_STATE_KEY);
      setHasPreviousQuiz(false);
    } catch (e) {
      console.error("Failed to clear state.", e);
    }
  };

  // --- Quiz Logic ---
  const startQuiz = (isContinuation = false) => {
    if (isContinuation) {
      continueQuiz();
    } else {
      setCurrentQuestionIndex(0);
      setScore(0);
      setTimeLeft(2700);
      setUserAnswers([]);
      setSelectedAnswers([]);
      setIsAnswerSubmitted(false);
      clearState();
      setScreen('quiz');
    }
  };

  const continueQuiz = async () => {
    const savedState = await loadState();
    if (savedState) {
      setCurrentQuestionIndex(savedState.currentQuestionIndex);
      setScore(savedState.score);
      setTimeLeft(savedState.timeLeft);
      setUserAnswers(savedState.userAnswers);
      setSelectedAnswers([]);
      setIsAnswerSubmitted(false);
      setScreen('quiz');
    }
  };

  const handleChoiceSelection = (choice: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers(prev => {
      if (prev.includes(choice)) {
        return prev.filter(a => a !== choice);
      } else {
        return [...prev, choice];
      }
    });
  };

  const handleSubmitAnswer = () => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const question = questions[currentQuestionIndex];
    const correctAnswers = question.answers;
    const sortedSelected = [...selectedAnswers].sort();
    const sortedCorrect = [...correctAnswers].sort();
    const isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);

    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
    }

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswers;
    setUserAnswers(newAnswers);

    saveState({
      currentQuestionIndex,
      score: newScore,
      timeLeft,
      userAnswers: newAnswers,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScreen('results');
    clearState();
  };

  const restartQuiz = () => {
    Alert.alert(
      "Restart Quiz",
      "Are you sure you want to restart? Your progress will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => {
            clearState();
            startQuiz(false);
        }}
      ]
    );
  };
  
  const reviewAnswers = () => {
      setScreen('review');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Render Functions for different screens ---
  const renderWelcomeScreen = () => (
    <View style={styles(colors).container}>
      <Text style={styles(colors).title}>Welcome to the Quiz!</Text>
      <Text style={styles(colors).paragraph}>
        Test your knowledge with {questions.length} multiple-choice questions.
      </Text>
      <Text style={styles(colors).paragraph}>You'll have 45 minutes to complete the quiz.</Text>
      <TouchableOpacity style={styles(colors).buttonPrimary} onPress={() => startQuiz(false)}>
        <Star color={colors.buttonTextPrimary} style={{ marginRight: 10 }} />
        <Text style={styles(colors).buttonTextPrimary}>Start New Quiz</Text>
      </TouchableOpacity>
      {hasPreviousQuiz && (
        <TouchableOpacity style={styles(colors).buttonSecondary} onPress={() => startQuiz(true)}>
          <RotateCcw color={colors.buttonTextSecondary} style={{ marginRight: 10 }} />
          <Text style={styles(colors).buttonTextSecondary}>Continue Previous Quiz</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderQuizScreen = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null; // Add a guard clause
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    
    return (
      <ScrollView style={styles(colors).container}>
        <View style={styles(colors).quizHeader}>
          <Text style={styles(colors).progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <Text style={styles(colors).timerText}>{formatTime(timeLeft)}</Text>
        </View>
        <View style={styles(colors).progressBarContainer}>
          <View style={[styles(colors).progressBar, { width: `${progress}%` }]} />
        </View>
        <View style={styles(colors).questionContainer}>
          <Text style={styles(colors).questionText}>{question.question}</Text>
          <Text style={styles(colors).hintText}>Select one or more options and click submit.</Text>
          
          {question.choices.map((choice, index) => {
            const isSelected = selectedAnswers.includes(choice);
            const isCorrect = question.answers.includes(choice);

            let buttonStyle: any[] = [styles(colors).choiceButton];
            let textStyle: any[] = [styles(colors).choiceText];
            let icon = null;

            if (isAnswerSubmitted) {
              if (isCorrect) {
                buttonStyle.push(styles(colors).correctChoice);
                textStyle.push(styles(colors).correctChoiceText);
                icon = <CheckCircle color={colors.success} size={24} />;
              } else if (isSelected && !isCorrect) {
                buttonStyle.push(styles(colors).incorrectChoice);
                textStyle.push(styles(colors).incorrectChoiceText);
                icon = <XCircle color={colors.error} size={24} />;
              }
            } else if (isSelected) {
              buttonStyle.push(styles(colors).selectedChoice);
            }

            return (
              <TouchableOpacity
                key={index}
                style={buttonStyle}
                onPress={() => handleChoiceSelection(choice)}
                disabled={isAnswerSubmitted}
              >
                <Text style={textStyle}>{choice}</Text>
                {isAnswerSubmitted && icon && <View style={{ marginLeft: 'auto' }}>{icon}</View>}
              </TouchableOpacity>
            );
          })}

          {isAnswerSubmitted && (
            <View style={styles(colors).explanationContainer}>
              <Text style={styles(colors).explanationTitle}>Explanation</Text>
              <Text style={styles(colors).explanationText}>{question.explanation}</Text>
            </View>
          )}

          <View style={styles(colors).quizFooter}>
            {!isAnswerSubmitted ? (
              <TouchableOpacity
                style={[styles(colors).buttonPrimary, selectedAnswers.length === 0 && styles(colors).buttonDisabled]}
                onPress={handleSubmitAnswer}
                disabled={selectedAnswers.length === 0}
              >
                <Text style={styles(colors).buttonTextPrimary}>Submit Answer</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles(colors).buttonSuccess} onPress={handleNextQuestion}>
                <Text style={styles(colors).buttonTextPrimary}>
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderResultsScreen = () => (
    <View style={styles(colors).container}>
      <Text style={styles(colors).title}>Quiz Complete!</Text>
      <Text style={styles(colors).scoreText}>
        You scored {score}/{questions.length}
      </Text>
      <View style={styles(colors).resultsProgressBarContainer}>
        <View style={[styles(colors).progressBar, { width: `${(score / questions.length) * 100}%` }]} />
      </View>
      <TouchableOpacity style={styles(colors).buttonPrimary} onPress={reviewAnswers}>
        <BookOpen color={colors.buttonTextPrimary} style={{ marginRight: 10 }} />
        <Text style={styles(colors).buttonTextPrimary}>Review Answers</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles(colors).buttonSecondary} onPress={restartQuiz}>
        <RotateCcw color={colors.buttonTextSecondary} style={{ marginRight: 10 }} />
        <Text style={styles(colors).buttonTextSecondary}>Restart Quiz</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReviewScreen = () => (
    <ScrollView style={styles(colors).container}>
        <Text style={styles(colors).title}>Review Answers</Text>
        {questions.map((q, index) => {
            const userAnswer = userAnswers[index] || [];
            const sortedUser = [...userAnswer].sort();
            const sortedCorrect = [...q.answers].sort();
            const isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);

            return (
                <View key={index} style={styles(colors).reviewBlock}>
                    <Text style={styles(colors).questionText}>{index + 1}. {q.question}</Text>
                    {q.choices.map((choice, choiceIndex) => {
                        let choiceStyle: any = styles(colors).reviewChoiceText;
                        if (q.answers.includes(choice)) {
                            choiceStyle = styles(colors).reviewCorrectText;
                        }
                        if (userAnswer.includes(choice) && !q.answers.includes(choice)) {
                            choiceStyle = styles(colors).reviewIncorrectText;
                        }
                        return <Text key={choiceIndex} style={choiceStyle}>- {choice}</Text>;
                    })}
                    <Text style={styles(colors).reviewAnswerLabel}>Your Answer: 
                        <Text style={isCorrect ? styles(colors).reviewCorrectText : styles(colors).reviewIncorrectText}> {userAnswer.join(', ') || 'Not answered'}</Text>
                    </Text>
                     <Text style={styles(colors).reviewAnswerLabel}>Correct Answer: 
                        <Text style={styles(colors).reviewCorrectText}> {q.answers.join(', ')}</Text>
                    </Text>
                    <View style={styles(colors).explanationContainer}>
                        <Text style={styles(colors).explanationTitle}>Explanation</Text>
                        <Text style={styles(colors).explanationText}>{q.explanation}</Text>
                    </View>
                </View>
            );
        })}
        <TouchableOpacity style={styles(colors).buttonPrimary} onPress={() => setScreen('welcome')}>
            <Text style={styles(colors).buttonTextPrimary}>Back to Start</Text>
        </TouchableOpacity>
    </ScrollView>
  );

  const renderContent = () => {
    switch (screen) {
      case 'quiz':
        return renderQuizScreen();
      case 'results':
        return renderResultsScreen();
      case 'review':
        return renderReviewScreen();
      case 'welcome':
      default:
        return renderWelcomeScreen();
    }
  };

  return (
    <SafeAreaView style={styles(colors).safeArea}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <View style={styles(colors).header}>
        <Text style={styles(colors).headerTitle}>Knowledge Quest</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles(colors).themeToggle}>
          {theme === 'dark' ? <Sun color={colors.icon} size={24} /> : <Moon color={colors.icon} size={24} />}
        </TouchableOpacity>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

// --- Styles ---
const lightTheme = {
  background: '#f9fafb', // gray-50
  text: '#1f2937', // gray-800
  primary: '#0891b2', // cyan-600
  primaryHover: '#0e7490', // cyan-700
  secondary: '#6b7280', // gray-500
  secondaryHover: '#4b5563', // gray-600
  success: '#16a34a', // green-600
  error: '#dc2626', // red-600
  card: '#ffffff',
  border: '#e5e7eb', // gray-200
  icon: '#1f2937',
  buttonTextPrimary: '#ffffff',
  buttonTextSecondary: '#ffffff',
  hintText: '#6b7280', // gray-500
  disabled: '#9ca3af', // gray-400
  explanationBg: '#f3f4f6', // gray-100
};

const darkTheme = {
  background: '#111827', // gray-900
  text: '#f3f4f6', // gray-100
  primary: '#0891b2', // cyan-600
  primaryHover: '#06b6d4', // cyan-500
  secondary: '#4b5563', // gray-600
  secondaryHover: '#374151', // gray-700
  success: '#22c55e', // green-500
  error: '#ef4444', // red-500
  card: '#1f2937', // gray-800
  border: '#374151', // gray-700
  icon: '#f3f4f6',
  buttonTextPrimary: '#ffffff',
  buttonTextSecondary: '#ffffff',
  hintText: '#9ca3af', // gray-400
  disabled: '#4b5563', // gray-600
  explanationBg: '#374151', // gray-700
};

const styles = (colors: typeof lightTheme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  themeToggle: {
    padding: 5,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    color: colors.hintText,
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    elevation: 2,
  },
  buttonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonSuccess: {
      backgroundColor: colors.success,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
  },
  buttonTextPrimary: {
    color: colors.buttonTextPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: colors.buttonTextSecondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: colors.hintText,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  questionContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  hintText: {
    fontSize: 14,
    color: colors.hintText,
    marginBottom: 20,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 10,
  },
  choiceText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  selectedChoice: {
    borderColor: colors.primary,
    backgroundColor: colors.explanationBg,
  },
  correctChoice: {
    borderColor: colors.success,
    backgroundColor: colors.explanationBg,
  },
  correctChoiceText: {
    color: colors.success,
    fontWeight: 'bold',
  },
  incorrectChoice: {
    borderColor: colors.error,
    backgroundColor: colors.explanationBg,
  },
  incorrectChoiceText: {
    color: colors.error,
    fontWeight: 'bold',
  },
  explanationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.explanationBg,
    borderRadius: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  explanationText: {
    fontSize: 14,
    color: colors.text,
  },
  quizFooter: {
    marginTop: 20,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 20,
  },
  resultsProgressBarContainer: {
      height: 20,
      backgroundColor: colors.border,
      borderRadius: 10,
      marginVertical: 20,
  },
  reviewBlock: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      elevation: 2,
  },
  reviewChoiceText: {
      fontSize: 15,
      color: colors.text,
      marginLeft: 10,
      marginVertical: 2,
  },
  reviewCorrectText: {
      fontSize: 15,
      color: colors.success,
      fontWeight: 'bold',
      marginLeft: 10,
  },
  reviewIncorrectText: {
      fontSize: 15,
      color: colors.error,
      textDecorationLine: 'line-through',
      marginLeft: 10,
  },
  reviewAnswerLabel: {
      fontSize: 15,
      color: colors.text,
      marginTop: 10,
      fontWeight: '500',
  }
});

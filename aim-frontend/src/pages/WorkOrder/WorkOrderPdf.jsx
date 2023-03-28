import React from "react";
import { Page, Text, View, Image, Document, StyleSheet } from "@react-pdf/renderer";
import { images } from '../../constants';
import * as moment from "moment";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    border: '1px solid #1D1D1D',
    borderRight: 0,
    marginBottom: '10px',
  },
  headerCol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '33.33%',
    textAlign: 'center',
    padding: 10,
    borderRight: '1px solid #1D1D1D',
    fontSize: 16,
    color: '#1D1D1D',
    textTransform: 'uppercase',
  },
  logos: {
    maxWidth: '150px',
    height: 'auto',
    objectFit: 'contain'
  },
  heading: {
    fontSize: '19px',
    color: '#2f75b5',
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  dataWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    margin: "6px 0",
  },
  col5: {
    width: "15%",
    paddingLeft: 10,
    paddingBottom: 8,
  },
  col7: {
    width: "85%",
    paddingLeft: 10,
    paddingBottom: 8,
  },
  generalLabel: {
    color: "#4a4949",
    fontSize: 8,
  },
  generalOut: {
    display: "flex",
    alignItems: "center",
    color: "#4a4949",
    fontSize: 8,
  },
  generalOutBold: {
    display: "flex",
    alignItems: "center",
    color: "#000",
    fontSize: 8,
    fontWeight: "Bold",
  },
  generalTable: {
    display: 'block',
    width: "100%",
    marginBottom: "10px",
    padding: "10px 0px",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    margin: 0,
    padding: 0,
    width: '100%',
  },
  th1: {
    fontSize: 7,
    color: '#fff',
    border: "1px solid #adacac",
    padding: "7px",
    textAlign: 'center',
    backgroundColor: '#2f75b5',
    borderRight: 0,
    margin: 0,
  },
  td: {
    fontSize: 7,
    color: '#000',
    border: "1px solid #adacac",
    padding: "4px",
    textAlign: 'center',
    borderRight: 0,
    borderTop: 0,
  },
  td1: {
    fontSize: 7,
    color: '#000',
    border: "1px solid #adacac",
    padding: "7px",
    textAlign: 'center',
    borderTop: 0,
  },
});

const WorkOrderPdf = ({ workOrder }) => {
  return (
    <Document>
      <Page style={styles.body} orientation="landscape">
        <View style={styles.header}>
          <View style={styles.headerCol}>
            <Image src={images.DubaiLogo} style={styles.logos} />
          </View>
          <View style={styles.headerCol}>
            <Text style={styles.heading}>Work Order</Text>
          </View>
          <View style={styles.headerCol}>
            <Image src={images.DeltaLogo} style={styles.logos} />
          </View>
        </View>
        <View style={styles.dataWrap}>
          <View style={styles.col5}>
            <Text style={styles.generalLabel}>Project Name</Text>
          </View>
          <View style={styles.col7}>
            <Text style={styles.generalOutBold}>
              : Explosion Proof(EX) Equipment - Inspection & Repair Works @ DPE
              Facilities
            </Text>
          </View>
          <View style={styles.col5}>
            <Text style={styles.generalLabel}>Client</Text>
          </View>
          <View style={styles.col7}>
            <Text style={styles.generalOutBold}>
              : Dubai Petroleum Establishment
            </Text>
          </View>
          <View style={styles.col5}>
            <Text style={styles.generalLabel}>Contractor</Text>
          </View>
          <View style={styles.col7}>
            <Text style={styles.generalOut}>
              : Delta Solutions Engineering Services
            </Text>
          </View>
          <View style={styles.col5}>
            <Text style={styles.generalLabel}>Date Updated</Text>
          </View>
          <View style={styles.col7}>
            <Text style={styles.generalOut}>
              : {moment(new Date()).format("DD-MM-YYYY hh:mm A")}
            </Text>
          </View>
        </View>
        <View
          style={[styles.generalTable, { borderCollapse: "border-collapse" }]}
        >
          <View style={styles.thead}>
            <View style={styles.tableRow}>
              <View style={[styles.th1, { width: "63px" }]}>
                <Text>WO Number</Text>
              </View>
              <View style={[styles.th1, { width: "50px" }]}>
                <Text>WO Date</Text>
              </View>
              <View style={[styles.th1, { width: "60px" }]}>
                <Text>Department</Text>
              </View>
              <View style={[styles.th1, { width: "77px" }]}>
                <Text>Maintenance Type</Text>
              </View>
              <View style={[styles.th1, { width: "60px" }]}>
                <Text>Description</Text>
              </View>
              <View style={[styles.th1, { width: "55px" }]}>
                <Text>Start Date</Text>
              </View>
              <View style={[styles.th1, { width: "55px" }]}>
                <Text>Duration</Text>
              </View>
              <View style={[styles.th1, { width: "55px" }]}>
                <Text>End Date</Text>
              </View>
              <View style={[styles.th1, { width: "47px" }]}>
                <Text>Status</Text>
              </View>
              <View style={[styles.th1, { width: "55px" }]}>
                <Text>Permit Type</Text>
              </View>
              <View style={[styles.th1, { width: "55px" }]}>
                <Text>Priority</Text>
              </View>
              <View style={[styles.th1, { width: "70px" }]}>
                <Text>Attachments</Text>
              </View>
              <View style={[styles.th1, { width: "70px" }]}>
                <Text>Completed/Total</Text>
              </View>
            </View>
          </View>
          {workOrder?.map((workOrder, index) => {
            return (
              <View style={styles.tbody}>
                <View style={styles.tableRow}>
                  <View style={[styles.td, { width: "63px" }]}>
                    <Text> {workOrder?.woNumber}</Text>
                  </View>
                  <View style={[styles.td, { width: "50px" }]}>
                    <Text>
                      {moment(workOrder?.woDate).format("DD/MM/YYYY")}
                    </Text>
                  </View>
                  <View style={[styles.td, { width: "60px" }]}>
                    <Text>{workOrder?.department}</Text>
                  </View>
                  <View style={[styles.td, { width: "77px" }]}>
                    <Text>{workOrder?.maintanaceType}</Text>
                  </View>
                  <View style={[styles.td, { width: "60px" }]}>
                    <Text>{workOrder?.description}</Text>
                  </View>
                  <View style={[styles.td, { width: "55px" }]}>
                    <Text>
                      {moment(workOrder?.startDate).format("DD/MM/YYYY")}
                    </Text>
                  </View>
                  <View style={[styles.td, { width: "55px" }]}>
                    <Text>{workOrder?.duration}</Text>
                  </View>
                  <View style={[styles.td, { width: "55px" }]}>
                    <Text>
                      {moment(workOrder?.startDate)
                        .add(workOrder?.duration, "days")
                        .format("DD/MM/YYYY")}
                    </Text>
                  </View>
                  <View style={[styles.td, { width: "47px" }]}>
                    <Text>{workOrder?.status}</Text>
                  </View>
                  <View style={[styles.td, { width: "55px" }]}>
                    <Text>{workOrder?.permitType}</Text>
                  </View>
                  <View style={[styles.td, { width: "55px" }]}>
                    <Text>{workOrder?.priority}</Text>
                  </View>
                  <View style={[styles.td, { width: "70px" }]}>
                    <Text>{workOrder?.attachments}</Text>
                  </View>
                  <View style={[styles.td1, { width: "70px" }]}>
                    <Text>{workOrder?.completed}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default WorkOrderPdf;
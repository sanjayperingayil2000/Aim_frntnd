import React from "react";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import { images } from "../../constants";
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
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    border: "1px solid #1D1D1D",
    borderRight: 0,
    marginBottom: "10px",
  },
  headerCol: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "33.33%",
    textAlign: "center",
    padding: 10,
    borderRight: "1px solid #1D1D1D",
    fontSize: 16,
    color: "#1D1D1D",
    textTransform: "uppercase",
  },
  logos: {
    maxWidth: "150px",
    height: "auto",
    objectFit: "contain",
  },
  heading: {
    fontSize: "15px",
    color: "#2f75b5",
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
    display: "block",
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
    width: "100%",
  },
  th1: {
    fontSize: 7,
    color: "#fff",
    border: "1px solid #adacac",
    padding: "7px 4px",
    textAlign: "center",
    backgroundColor: "#2f75b5",
    borderRight: 0,
    margin: 0,
  },
  th2: {
    fontSize: 7,
    color: "#000",
    border: "1px solid #adacac",
    padding: "7px 4px",
    textAlign: "center",
    backgroundColor: "#bdd7ee",
    borderRight: 0,
    margin: 0,
  },
  th3: {
    fontSize: 7,
    color: "#000",
    border: "1px solid #adacac",
    padding: "7px 4px",
    textAlign: "center",
    backgroundColor: "#ddebf7",
    borderRight: 0,
    margin: 0,
  },
  th4: {
    fontSize: 7,
    color: "#000",
    border: "1px solid #adacac",
    padding: "7px 4px",
    textAlign: "center",
    backgroundColor: "#ddebf7",
    margin: 0,
  },
  td: {
    fontSize: 7,
    color: "#000",
    border: "1px solid #adacac",
    padding: "7px 4px",
    textAlign: "center",
    borderRight: 0,
    borderTop: 0,
  },
  td1: {
    fontSize: 7,
    color: "#000",
    border: "1px solid #adacac",
    padding: "7px 4px",
    textAlign: "center",
    borderTop: 0,
  },
  td2: {
    fontSize: 7,
    color: "#000",
    border: "1px solid #adacac",
    padding: "7px 4px",
    textAlign: "left",
    borderTop: 0,
    borderRight: 0,
  },
  td3: {
    fontSize: 7,
    color: "#000",
    border: "1px solid #adacac",
    padding: "7px 4px",
    textAlign: "left",
    borderRight: 0,
    borderTop: 0,
    textOverflow: "ellipsis",
  },
  tdText: {
    fontSize: 7,
    color: "#000",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    display: "inline-block",
    width: 12,
    height: 12,
    objectFit: "contain",
  },
  defect: {
    display: "inline-block",
    width: 8,
    height: 8,
    objectFit: "contain",
  },
  defectFlex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
});

const AssetPdf = ({ assets }) => {
  return (
    <Document>
      <Page style={styles.body} orientation="landscape">
        <View style={styles.header}>
          <View style={styles.headerCol}>
            <Image src={images.DubaiLogo} style={styles.logos} />
          </View>
          <View style={styles.headerCol}>
            <Text style={styles.heading}>Asset Register</Text>
          </View>
          <View style={styles.headerCol}>
            <Image src={images.DeltaLogo} style={styles.logos} />
          </View>
        </View>
        <View style={styles.dataWrap}>
          <View style={styles.col5}>
            <Text style={styles.generalLabel}>Contractor Name</Text>
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
              : {(moment(new Date()).format("DD-MM-YYYY hh:mm A"))}
            </Text>
          </View>
        </View>
        <View style={[styles.generalTable, { borderCollapse: "border-collapse", pageBreakInside: "auto" }]}>
          <View style={[styles.thead, { display: "table-header-group" }]}>
            <View style={styles.tableRow}>
              <View style={[styles.th1, { width: "18px" }]}>
                <Text>Sl No</Text>
              </View>
              <View style={[styles.th1, { width: "43px" }]}>
                <Text>RFID Reference</Text>
              </View>
              <View style={[styles.th1, { width: "45px" }]}>
                <Text>Location</Text>
              </View>
              <View style={[styles.th1, { width: "30px" }]}>
                <Text>Area</Text>
              </View>
              <View style={[styles.th1, { width: "35px" }]}>
                <Text>Zone</Text>
              </View>
              <View style={[styles.th2, { width: "50px" }]}>
                <Text>Equipment Tag</Text>
              </View>
              <View style={[styles.th2, { width: "55px" }]}>
                <Text>Description</Text>
              </View>
              <View style={[styles.th2, { width: "60px" }]}>
                <Text>Manufacturer</Text>
              </View>
              <View style={[styles.th2, { width: "48px" }]}>
                <Text>Equiment T-Class</Text>
              </View>
              <View style={[styles.th2, { width: "48px" }]}>
                <Text>Equipment Gas group</Text>
              </View>
              <View style={[styles.th2, { width: "45px" }]}>
                <Text>Protection Type</Text>
              </View>
              <View style={[styles.th3, { width: "102px" }]}>
                <Text>Findings</Text>
              </View>
              <View style={[styles.th3, { width: "92px" }]}>
                <Text>Remedial Actions</Text>
              </View>
              <View style={[styles.th3, { width: "46px" }]}>
                <Text>Inspection Status</Text>
              </View>
              <View style={[styles.th3, { width: "40px" }]}>
                <Text>Repairs Done</Text>
              </View>
              <View style={[styles.th4, { width: "38px" }]}>
                <Text>Current Status</Text>
              </View>
            </View>
          </View>
          {assets?.map((asset, index) => {
            return (
              <View style={styles.tbody}>
                <View style={[styles.tableRow, { pageBreakInside: "avoid", pageBreakAfter: "auto" }]}>
                  <View style={[styles.td, { width: "18px" }]}>
                    <Text style={styles.tdText}>{index + 1}</Text>
                  </View>
                  <View style={[styles.td3, { width: "43px", writingMode: "vertical-rl", textOrientation: "mixed" }]}>
                    <Text style={styles.tdText}>{asset?.rfidRef}</Text>
                  </View>
                  <View style={[styles.td, { width: "45px" }]}>
                    <Text style={styles.tdText}>{asset?.location}</Text>
                  </View>
                  <View style={[styles.td, { width: "30px" }]}>
                    <Text style={styles.tdText}>{asset?.area}</Text>
                  </View>
                  <View style={[styles.td, { width: "35px" }]}>
                    <Text style={styles.tdText}>{asset?.zone} </Text>
                  </View>
                  <View style={[styles.td, { width: "50px" }]}>
                    <Text style={styles.tdText}>{asset?.eqpmtTag}</Text>
                  </View>
                  <View style={[styles.td, { width: "55px" }]}>
                    <Text style={styles.tdText}>{asset?.description}</Text>
                  </View>
                  <View style={[styles.td, { width: "60px" }]}>
                    <Text style={styles.tdText}>{asset?.manufacturer}</Text>
                  </View>
                  <View style={[styles.td, { width: "48px" }]}>
                    <Text style={styles.tdText}>{asset?.equipmentTClass}</Text>
                  </View>
                  <View style={[styles.td, { width: "48px" }]}>
                    <Text style={styles.tdText}>
                      {asset?.equipmentGasGroup}
                    </Text>
                  </View>
                  <View style={[styles.td, { width: "45px" }]}>
                    <Text style={styles.tdText}>{asset?.protectionType}</Text>
                  </View>
                  <View style={[styles.td2, { width: "102px" }]}>
                    {asset?.checkList?.map((item, i) =>
                      item?.findingsAndActions.map((list, i) => {
                        if (list.isSelected != undefined) {
                          if (list?.isSelected === true) {
                            return (
                              <Text style={styles.tdText}>
                                {" "}
                                {list?.defectCode}. {list?.finding}
                              </Text>
                            );
                          }
                        }
                      })
                    )}
                  </View>
                  <View style={[styles.td2, { width: "92px" }]}>
                    {asset?.checkList?.map((item, i) =>
                      item?.findingsAndActions.map((list, i) => {
                        if (list.isSelected != undefined) {
                          if (list?.isSelected === true) {
                            return (
                              <Text style={styles.tdText}>
                                {list?.defectCode}. {list?.remedialAction}
                              </Text>
                            );
                          }
                        }
                      })
                    )}
                  </View>

                  <View style={[styles.td, { width: "46px" }]}>
                    <View style={styles.flex}>
                      {asset?.inspectionStatus == "Red" ? (
                        <Image style={styles.flag} src={images.RedFlag} />
                      ) : asset?.inspectionStatus == "Green" ? (
                        <Image style={styles.flag} src={images.GreenFlag} />
                      ) : asset?.inspectionStatus == "Yellow" ? (
                        <Image style={styles.flag} src={images.YellowFlag} />
                      ) : (
                        ""
                      )}
                      {/* <Image style={styles.flag} src={images.correct} />
                      <Image style={styles.flag} src={images.remove} /> */}
                      <Text style={styles.tdText}>
                        {asset?.inspectionStatus}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.td, { width: "40px" }]}>
                    {asset?.checkList?.map((item, i) =>
                      item?.findingsAndActions.map((list, i) => {
                        if (list.isSelected != undefined) {
                          if (list?.isSelected === true) {
                            return (
                              <View style={styles.defectFlex}>
                                <Text style={styles.tdText}>
                                  {" "}
                                  {list?.defectCode}
                                </Text>
                                {list?.isDone ? (
                                  <Image
                                    src={images.correct}
                                    style={styles.defect}
                                  />
                                ) : (
                                  <Image
                                    src={images.remove}
                                    style={styles.defect}
                                  />
                                )}{" "}
                              </View>
                            );
                          }
                        }
                      })
                    )}
                  </View>
                  <View style={[styles.td1, { width: "38px" }]}>
                    <View style={styles.flex}>
                      {asset?.currentStatus == "Red" ? (
                        <Image style={styles.flag} src={images.RedFlag} />
                      ) : asset?.currentStatus == "Green" ? (
                        <Image style={styles.flag} src={images.GreenFlag} />
                      ) : asset?.currentStatus == "Yellow" ? (
                        <Image style={styles.flag} src={images.YellowFlag} />
                      ) : (
                        ""
                      )}
                      <Text style={styles.tdText}>{asset?.currentStatus}</Text>
                    </View>
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

export default AssetPdf;

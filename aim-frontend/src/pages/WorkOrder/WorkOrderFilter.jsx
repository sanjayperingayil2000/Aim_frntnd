import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { BiFilterAlt } from 'react-icons/bi';
import { images } from '../../constants';
import { Form, FormSelect, DateRange, Button, PageHeader, MultiSelect } from '../../components';
import { Row, Col } from 'react-bootstrap';
import { statusData, priorityData } from '../../data/workOrderFilterData';
import workOrderService from '../../services/workOrderService';

const WorkOrderFilter = ({ className }) => {
    const [isFilter, setFilter] = useState(true);
    const [values,setValues]=useState({});
    const toggleFilter = () => setFilter(!isFilter);

    useEffect(() => {
        function handleMedia() {
          if (window.innerWidth < 992) {
            setFilter(false);
          } else {
            setFilter(true);
          }
        }
        handleMedia();
        window.addEventListener("resize", handleMedia);
    }, []);

    const handleStatus = (event, data) => {
        setValues({...values, status: data.value});
      }
    const handlePriority = (event, data) => {
        setValues({...values, priority:data.value});
        
      } 
      const handleStartRange = (event, data) => {
        setValues({...values, startDate:data.value})
    }
      const handleEndRange = (event, data) => {
        setValues({...values, endDate:data.value})
    }

    const handleFilter = (e) => {
        e.preventDefault();
        try { 
           workOrderService.getAllWorkOrder(values).then(
            (response) => {
              console.log("response");
              
            },
            (error) => {
              console.log(error);
            }
          );
        } catch (err) {
          console.log(err);
        }
    }
    
    const downloadExcel = () => {
        workOrderService.getAllWorkOrderReport();  
    }

    const downloadPdf = () => {
        workOrderService.getAllWorkOrderPdf();  
    }

    const handleClear = ( ) => {
        setValues('');
    }

    const filterAnim = {
        hidden: {
            opacity: 0,
            height: '0px',
            marginBottom: '0',
            transition: {
                all: 0.5
            },
        },
        show: {
            opacity: 1,
            height: '220px',
            marginBottom: '50px',
            transition: {
                all: 0.5
            },
        },
    }

    const formAnim = {
        hidden: {
            opacity: 0,
            display: 'none',
            transition: {
                all: 0.5
            },
        },
        show: {
            opacity: 1,
            display: 'block',
            transition: {
                all: 0.5
            },
        },
    }

    return (
        <>
            <PageHeader title='Work Order' className='filter-btns'>
                <Button variant='click-info' size='click-sm' disabled>
                    <div className='disabled__data'>
                        <span className='disabled__label'>Overdue WO's</span>
                        <span className='disabled__divider'>|</span>
                        <span className='disabled__value'>162</span>
                    </div>
                </Button>
                <Link to='/work-order/add' className='btn-link'>
                    <Button variant='click-info' size='click-sm'>
                        <AiOutlinePlusCircle size={20} />
                        <span>Add</span>
                    </Button>
                </Link>
                <Button onClick={() => downloadExcel()} variant='click-info' size='click-sm'>
                    <img src={images.excel} alt='Export to Excel' />
                    <span>Excel</span>
                </Button>
                <Button onClick={() => downloadPdf()} variant='click-info' size='click-sm'>
                <img src={images.print} alt='Print Document' />
                    <span>Print</span>
                </Button>
                <Button size='click-sm' onClick={toggleFilter} className='filter-btn' variant={`${isFilter ? 'click-primary' : 'click-info'}`}>
                    <BiFilterAlt size={20} />
                    <span>Filter</span>
                </Button>
            </PageHeader>
            <div className={`app__filter work_filter ${className} ${isFilter && 'show'}`}>
                <motion.div 
                    animate={isFilter ? "show" : "hidden"}
                    variants={formAnim}
                    initial='show'
                    exit='hidden'
                >
                    <Form className='filter' onSubmit={handleFilter}>
                        <Row>
                            <Col xl={4} lg={4} md={6}>
                                <MultiSelect 
                                    label='WO by Status'
                                    placeholder='Select Status'
                                    data={statusData}
                                    onChange={handleStatus}
                                />
                            </Col>
                            
                            <Col xl={4} lg={4} md={6}>
                                <MultiSelect 
                                    label='Work Order Priority'
                                    placeholder='Select Priority'
                                    data={priorityData}
                                    onChange={handlePriority}
                                />
                            </Col>
                            <Col xl={4} lg={4} md={6}>
                                <DateRange 
                                handleFrom={handleStartRange}
                                handleTo={handleEndRange}
                                fromDate={values.startDate}
                                toDate={values.endDate}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={12} lg={12}>
                                <div className='app__btns submit'>
                                    <Button onClick={handleClear} variant='click-gray' size='click-lg' type='button'>Clear</Button>
                                    <Button variant='click-primary' size='click-lg' type='submit'>Apply</Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </motion.div>
            </div>
        </>
    )
}

export default WorkOrderFilter;
<!-- =========================================================================================
  File Name: DashboardAnalytics.vue
  Description: Dashboard Analytics
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="dashboard-executive">

    <!-- bar chart for the sales and expenses -->
    <vx-card title="Sales & Finance" class="mb-base">
      <div class="component-high-charts w-full">
        <div slot="no-body">
          <high-charts :chartOptions="salesFinanceChartOptions"></high-charts>
        </div>
      </div>
    </vx-card>

    <!-- pie chart for sales and expenses -->
    <vx-card title="Expenses & Refunds" class="mb-base">

      <!-- card actions to select the month and year value -->
      <template slot="actions">
        <vs-dropdown vs-trigger-click class="cursor-pointer">
          <small class="flex cursor-pointer">
            <span><b>{{activeMonthYear | monthAndYear}}</b></span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" class="ml-1" />
          </small>
          <vs-dropdown-menu class="w-32">
            <vs-dropdown-item v-for="value in monthYearList" :key="value" @click="getSalesExpenseChartData(value)">{{value | monthAndYear}}</vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </template>
      <!-- Chart area -->
      <div class="component-high-charts w-full">
        <div slot="no-body">
          <high-charts :chartOptions="expensesChartOptions"></high-charts>
        </div>
      </div>

    </vx-card>
  </div>
</template>

<script>

// API provider file import
import eva from '../http/requests/eva/index.js'

// Highchart component import
import HighCharts from '../views/charts-and-maps/charts/high-charts/HighCharts.vue'

export default {
  data () {
    return {
      activeMonthYear: '',
      monthYearList: [],
      saleFinancesData: {},
      currency: '',
      pieChartSeries: []
    }
  },
  components: {
    HighCharts
  },
  computed: {
    // Prepare the chart option for the sales and expenses chart
    expensesChartOptions: function () {
      // vue model variable decaration to acces the vue object inside the child functions
      const vm = this

      // chartOptions preparations
      const chartOptions = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: ''
        },
        accessibility: {
          point: {
            valuePrefix: this.currency
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        legend: {
          enabled: true,
          layout: 'vertical',
          align: 'right',
          width: 500,
          verticalAlign: 'middle',
          useHTML: true,
          labelFormatter: function() {
            return '<div style="width:450px;float:left;font-size:15px;">' + this.name + ' &nbsp; ' + vm.currency + this.y + '</div>'
          }
        },
        series: [{
            name: 'Expenses & Refunds',
            data: this.pieChartSeries.map(itm => { return { name: itm['type'], y: itm['amount'] }})
        }]
      }

      // Return the chart options
      return chartOptions
    },
    // Prepare the sales and finance chart options
    salesFinanceChartOptions () {
      // vue model variable decaration to acces the vue object inside the child functions
      const vm = this

      // Sales and finance data storage
      const data = Object.values(this.saleFinancesData)

      // Sale data assignment by month and year value
      const saleData = {}
      data.forEach(salesData => {
        saleData[salesData.date] = salesData
      })

      // Get the month and year value to assign for the x axis
      this.setMonthAndYearList(Object.keys(saleData))

      // Keylist preparation to show the label in the toolip
      const keyList = {
        'reimbursement': ['Reimbursement', 'group1'],
        'totalSales': ['Total Sales', 'group1'],
        'refund': ['Total Refund', 'group2'],
        'totalExpenses': ['Total Expenses', 'group2']
      }

      // series data
      const seriesdata = []
      Object.keys(keyList).forEach((key) => {
        const item = {
          name: keyList[key][0],
          data: data.map(item => item[key]),
          stack: keyList[key][1],
          type: 'column'
        }
        seriesdata.push(item)
      })

      // Line data for the quantity records
      const splineData = {
        type: 'spline',
        name: 'Quantity',
        data: data.map(item => item['itemQuantity']),
        yAxis: 1,
        marker: {
            lineWidth: 2,
            fillColor: 'orange'
        }
      }
      seriesdata.push(splineData)

      // Chart options preparation
      const chartOptions = {
        chart: {
          type: 'column'
        },
        title: {
          text: ''
        },
        colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
        '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
        xAxis: {
          categories: Object.keys(saleData),
          labels: {
            formatter: function () {
              // Use the vue filter to format the x-axis records
              return vm.$options.filters.monthAndYear(this.value)
            }
          }
        },
        yAxis: [{ // Primary yAxis
          labels: {
            format: `${vm.currency}{value}`
          },
          title: {
            text: `Amount (${vm.currency})`
          }
        }, { // Secondary yAxis
          title: {
            text: 'Quantity (Units)'
          },
          labels: {
            format: '{value}'
          },
          opposite: true
        }],
        plotOptions: {
          column: {
            stacking: 'normal'
          },
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function () {
                  vm.getSalesExpenseChartData(this.category)
                }
              }
            }
          }
        },
        series: seriesdata,
        tooltip: {
          formatter: function () {
            const currentRecord = saleData[this.x] || false
            if (!currentRecord) return ''
            return `<ul><li>Reimbursement: ${vm.currency+currentRecord.reimbursement}</li><br><li>Total Sales: ${vm.currency+currentRecord.totalSales}</li><br><li>Total Refund: ${vm.currency+currentRecord.refund}</li><br><li>Total Expenses: ${vm.currency+currentRecord.totalExpenses}</li><br><li>Quantity: ${currentRecord.itemQuantity}</li><br><li>Average Sales Price: ${vm.currency+currentRecord.avgSalesPrice}</li>`
          }
        }
      }

      // return the chart options
      return chartOptions
    }
  },
  created () {
    // Loading
    this.$vs.loading()

    // Payload the Sale Finance API Request
    const payload = {
      marketplace: 'Amazon.com',
      sellerId: 'A2AYEFBRNOKNF9'
    }

    // API request to get the Sale Finance data for the above payload
    eva.getSaleFinance(payload).then(response => {
      // Currency value assignment from the response
      this.currency = response.data.Data.Currency

      // Assign the sale finance data
      this.saleFinancesData = response.data.Data.item

      // Get the Sales and Expenses chart data for the first item
      this.getSalesExpenseChartData(response.data.Data.item[0].date)

      // Close the loader
      this.$vs.loading.close()
    })
  },
  filters: {
    // Format the given number value and returns the Month name and year value
    monthAndYear: function (monthAndYear) {
      // Split the given value to separate the month and year value
      const splittedValue = monthAndYear.split('/')[0].split('-')

      // If the value not found, then return the input
      if (!splittedValue) return monthAndYear

      // Month list
      const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"]

      // convert the number into array index value to get the month name
      const monthIndex = parseInt(splittedValue[1]) - 1

      // Return the month and year name as formatted output
      return `${monthList[monthIndex]} ${splittedValue[0]}`
    }
  },
  methods: {
    // Get the sales and expenses value for the given month and year value
    getSalesExpenseChartData (monthAndYear) {
      // Assign the selected/clicked Month and Year value
      this.activeMonthYear = monthAndYear

      // Split the value to get the month and year value
      const splittedValue = monthAndYear.split('/')[0].split('-')

      // If value is not found, then return empty {}
      if (!splittedValue) return {}

      // Payload construction for the expense and refund API request
      const payload = {
        marketplace: 'Amazon.com',
        sellerId: 'A2AYEFBRNOKNF9',
        date: {
          month: splittedValue[1],
          year: splittedValue[0]
        }
      }

      // API request to get the values for the month and year value
      eva.getExpenseAndRefunds(payload).then(response => {

        // Assign the response value to data property
        this.pieChartSeries = response.data.Data.item

        // Close the loader
        this.$vs.loading.close()

      })
    },
    setMonthAndYearList(monthYearList) {
      this.monthYearList = monthYearList
    }
  }
}
</script>

<style lang="scss">
/*! rtl:begin:ignore */
/*! rtl:end:ignore */
</style>

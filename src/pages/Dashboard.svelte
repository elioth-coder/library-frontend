<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import { Hr, Heading, Card } from "flowbite-svelte";
  import DashboardService from "../services/DashboardService";
  import { onMount } from "svelte";
  import ApexCharts from "apexcharts";
  import { format, subDays } from "date-fns";
  import UserService from '../services/UserService';
  import { replace } from "svelte-spa-router";

  let dashboardService = new DashboardService();
  let userService = new UserService();
  let crumbs = [];
  let booksPieChartContainer, visitorsLineChartContainer;
  let borrowed = 0,
    missing = 0,
    available = 0,
    newBooks = 0,
    total = 0;

  onMount(async () => {
    let user = await userService.me();

    if(user.role != 'Admin') {
      replace('#/user');
    }
    let borrowedResults = await dashboardService.countBooks("Borrowed");
    let missingResults = await dashboardService.countBooks("Missing");
    let availableResults = await dashboardService.countBooks("Available");
    let newBooksResults = await dashboardService.countBooks("New");
    let dailyVisitorsResults = await dashboardService.dailyVisitors();
    let dailyVisitors = dailyVisitorsResults[0];

    console.log({ dailyVisitors });

    borrowed = borrowedResults[0].count;
    missing = missingResults[0].count;
    available = availableResults[0].count;
    newBooks = newBooksResults[0].count;
    total = borrowed + missing + available;

    let booksPieChartOptions = {
      legend: {
        labels: {
          colors: ["#FFF", "#FFF", "#FFF"],
        },
      },
      labels: [`Borrowed`, `Missing`, `Available`],
      series: [borrowed, missing, available],
      chart: {
        type: "donut",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "22px",
                fontFamily: "Rubik",
                color: "#fff",
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: "25px",
                fontFamily: "Helvetica, Arial, sans-serif",
                color: "#fff",
                offsetY: 16,
                formatter: function (val) {
                  return val;
                },
              },
              total: {
                show: true,
                label: "Total",
                color: "#fff",
                fontSize: "12px",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    let booksPieChart = new ApexCharts(
      booksPieChartContainer,
      booksPieChartOptions
    );

    booksPieChart.render();

    let visitorsLineChartOptions = {
      series: [
        {
          name: "Visitors",
          data: [
            dailyVisitors.day_1,
            dailyVisitors.day_2,
            dailyVisitors.day_3,
            dailyVisitors.day_4,
            dailyVisitors.day_5,
            dailyVisitors.day_6,
            dailyVisitors.day_7,
          ],
        },
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: ["#FFF"],
          },
        },
      },
      xaxis: {
        categories: (() => {
          let categories = [];

          for (let i = 6; i >= 0; i--) {
            const day = subDays(new Date(), i);
            const monthDay = format(day, "MMMM d");

            categories.push(monthDay);
          }

          return categories;
        })(),
        labels: {
          style: {
            colors: ["#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF"],
          },
        },
      },
    };

    let visitorsLineChart = new ApexCharts(
      visitorsLineChartContainer,
      visitorsLineChartOptions
    );
    visitorsLineChart.render();
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="flex">
      <div class="w-2/3 p-3">
        <Card size="xl" padding="sm">
          <Heading tag="h5">Visitor count for the last 7 days</Heading>
          <div bind:this={visitorsLineChartContainer}></div>
        </Card>
      </div>
      <div class="w-1/3 p-3 flex flex-col">
        <Card size="xl" padding="sm">
          <Heading tag="h5">Books</Heading>
          <div bind:this={booksPieChartContainer}></div>
        </Card>
        <Card size="xl" class="mt-8" padding="sm">
          <Heading tag="h5">New books</Heading>
          <Hr hrClass="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
          <Heading tag="h1" class="text-center mt-3 mb-2.5">{newBooks}</Heading>
        </Card>
      </div>
    </div>
    <Hr />
  </main>
</Layout>

<script>
  // @ts-nocheck

  import * as faceapi from "face-api.js";
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import {
    CheckCircleOutline,
    ExclamationCircleOutline,
  } from "flowbite-svelte-icons";
  import {
    Heading,
    Spinner,
    Alert,
  } from "flowbite-svelte";

  import { onDestroy, onMount } from "svelte";
  import EntryLogService from "../services/EntryLogService";
  import EntryLogCrudTable from "../components/entry_log/EntryLogCrudTable.svelte";

  let { HOST } = CONFIG;
  let crumbs = [
    {
      href: "#/entry_logger",
      title: "Entry Logger",
    },
  ];
  let video;
  let previous = null;
  let intervalId = null;
  let imageData = null;
  let columns = ["member_id", "dt_logged"];
  let status = {
    state: "idle",
    data: null,
  };
  let entryLogService = new EntryLogService();

  let asyncItems = entryLogService.getAll();

  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const stopWebcam = () => {
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      video.srcObject = null;
    }
  };

  const handleVideo = () => {
    if (!video) return;

    const canvas = faceapi.createCanvasFromMedia(video);
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    document.getElementById("video-container").append(canvas);
    faceapi.matchDimensions(canvas, {
      height: video.height,
      width: video.width,
    });

    intervalId = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const resizedDetections = faceapi.resizeResults(detections, {
        height: video.height,
        width: video.width,
      });
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      if (detections.length) {
        if (!["processing", "success", "error"].includes(status.state)) {
          const hidden_canvas = document.getElementById("hidden-canvas");
          const ctx = hidden_canvas.getContext("2d");
          hidden_canvas.width = video.videoWidth;
          hidden_canvas.height = video.videoHeight;

          ctx.drawImage(video, 0, 0, hidden_canvas.width, hidden_canvas.height);

          const imageDataURL = hidden_canvas.toDataURL("image/png");
          imageData = imageDataURL;
          let formData = new FormData();
          formData.set("base64_file", imageData);
          status.state = "processing";
          try {
            let item = await entryLogService.findFace(formData);
            status.state = "success";
            status.data = item;

            if (previous?.member.id != item?.member.id) {
              previous = item;
              formData.set("member_id", item.member.id);
              let logged = await entryLogService.add(formData);
              asyncItems = entryLogService.getAll();
            }
          } catch (e) {
            status.state = "error";
            status.message = e.message;
          } finally {
            setTimeout(() => {
              status.state = "idle";
            }, 5000);
          }
        }
      }
    }, 100);
  };

  onMount(() => {
    if (video) {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(`${HOST}/static/models`),
        faceapi.nets.faceLandmark68Net.loadFromUri(`${HOST}/static/models`),
      ]).then(startWebcam);

      video.addEventListener("play", handleVideo, false);
    }
  });

  onDestroy(() => {
    stopWebcam();
    video.removeEventListener("play", handleVideo, false);
    clearInterval(intervalId);
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="p-3">
      <Heading tag="h1" class="mb-4 text-xl sm:text-2xl">Entry Logger</Heading>
      <div class="flex">
        <div class="pe-5 flex flex-col w-full dark:text-white">
          <div class="overflow-y-scroll max-h-96">
            <EntryLogCrudTable {asyncItems} {columns} />
          </div>
        </div>
        <div style="min-width: 360px;">
          <div>
            <!-- svelte-ignore a11y-media-has-caption -->
            <section id="video-container" class="relative">
              <video bind:this={video} width="360" height="270" autoplay></video>
            </section>
            <canvas id="hidden-canvas" class="hidden"></canvas>
          </div>
          {#if imageData && status.state != "idle"}
            <div class="flex mb-3">
              <!-- <img src={imageData} alt="base64 data" style="height: 75px;" /> -->
              {#if status.state == "processing"}
                <div class="text-center w-full pt-2">
                  <Alert color="yellow">
                    <Spinner size={4} class="mx-2" />
                    Searching for a face match in the database...
                  </Alert>
                </div>
              {/if}
              {#if status.state == "success"}
                <div class="w-full pt-2 text-center">
                  <Alert color="green">
                    <CheckCircleOutline class="inline-block" />
                    A face match was found for
                    <br />{status.data.member.type.toLowerCase()}:
                    {status.data.member.first_name}
                    {status.data.member.last_name}.
                  </Alert>
                </div>
              {/if}
              {#if status.state == "error"}
                <div class="w-full pt-2 text-center">
                  <Alert color="red">
                    <ExclamationCircleOutline class="inline-block" />
                    {status.message}
                  </Alert>
                </div>
              {/if}
            </div>
          {:else}
            <div style="height: 75px;" class="mb-3"></div>
          {/if}
        </div>
      </div>
    </div>
  </main>
</Layout>

<style>
  #video-container {
    width: auto;
    height: auto;
    display: inline-block;
  }
</style>

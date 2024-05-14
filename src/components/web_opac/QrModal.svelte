<script>
import { Button, Heading, Modal, P } from 'flowbite-svelte';
import QRCode from 'qrcode';
export let openQR;
export let queueNumber;

let qrImage;

const generateQR = async text => {
  try {
    let qr = await QRCode.toDataURL(text);

    return qr;
  } catch (err) {
    console.error(err)
  }
}

const printReceipt = (qrImage, queueNumber) => {
  fetch("http://localhost:3000/api", {
      // Adding method type
      method: "POST",

      // Adding body or contents to send
      body: JSON.stringify({
        content: `
        <img src="${qrImage}" style="display: block; height: 150px; margin: 0 auto;" /> <br>
        <h3 style="text-align: center; font-size: 30px; margin:0;">Queue #: ${queueNumber}</h3>
        `,
      }),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
}

$: {
  (async () => {
    if(queueNumber) {
      qrImage = await generateQR(queueNumber);

      printReceipt(qrImage, queueNumber);
    }
  })()

}
</script>

<Modal title="Queuing Number" bind:open={openQR} on:close size="sm">
  <Heading tag="h4" class="text-center text-green">Successfully reserved books!</Heading>
  {#if qrImage}
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src={qrImage} style="width: 200px" class="mx-auto block"/>
  {/if}
  <Heading tag="h3" class="text-center ">Queue #: {queueNumber}</Heading>
  <svelte:fragment slot="footer">
    <Button on:click={() => (openQR = false)} color="alternative">
      Close
    </Button>
  </svelte:fragment>
</Modal>
